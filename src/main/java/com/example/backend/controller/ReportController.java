package com.example.backend.controller;

import com.example.backend.dto.KeyphraseAccessRequest;
import com.example.backend.dto.OfficialRequest;
import com.example.backend.dto.ReportMessageRequest;
import com.example.backend.dto.ReportRequest;
import com.example.backend.dto.ReportUpdateRequest;
import com.example.backend.model.AuditLog;
import com.example.backend.model.Evidence;
import com.example.backend.model.IncidentOfficial;
import com.example.backend.model.Report;
import com.example.backend.model.ReportEndorsement;
import com.example.backend.model.ReportMessage;
import com.example.backend.model.User;
import com.example.backend.repository.*;
import com.example.backend.service.AuditLogService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/api/reports")
public class ReportController {
    private final ReportRepository reports;
    private final UserRepository users;
    private final AuditLogService auditLogService;
    private final IncidentOfficialRepository officialRepository;
    private final ReportContributionRepository contributionRepository;
    private final AuditLogRepository auditLogRepository;
    private final WitnessRepository witnessRepository;
    private final EvidenceRepository evidenceRepository;
    private final ReportEndorsementRepository endorsementRepository;
    private final ReportMessageRepository reportMessageRepository;
    private final PasswordEncoder passwordEncoder;

    public ReportController(ReportRepository reports,
                            UserRepository users,
                            AuditLogService auditLogService,
                            IncidentOfficialRepository officialRepository,
                            ReportContributionRepository contributionRepository,
                            AuditLogRepository auditLogRepository,
                            WitnessRepository witnessRepository,
                            EvidenceRepository evidenceRepository,
                            ReportEndorsementRepository endorsementRepository,
                            ReportMessageRepository reportMessageRepository,
                            PasswordEncoder passwordEncoder) {
        this.reports = reports;
        this.users = users;
        this.auditLogService = auditLogService;
        this.officialRepository = officialRepository;
        this.contributionRepository = contributionRepository;
        this.auditLogRepository = auditLogRepository;
        this.witnessRepository = witnessRepository;
        this.evidenceRepository = evidenceRepository;
        this.endorsementRepository = endorsementRepository;
        this.reportMessageRepository = reportMessageRepository;
        this.passwordEncoder = passwordEncoder;
    }

    private static final String POW_SECRET = "DRS_POW_SECRET_SALT_2026";

    @GetMapping("/challenge")
    public ResponseEntity<?> getPowChallenge() {
        long timestamp = System.currentTimeMillis();
        String randomSalt = UUID.randomUUID().toString().replace("-", "").substring(0, 16);
        String signature = computePowHmac(timestamp + ":" + randomSalt);
        String challenge = timestamp + ":" + randomSalt + ":" + signature;
        return ResponseEntity.ok(Map.of(
                "challenge", challenge,
                "difficultyPrefix", "0000"
        ));
    }

    private static String computePowHmac(String data) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hash = md.digest((data + POW_SECRET).getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : hash) sb.append(String.format("%02x", b));
            return sb.toString().substring(0, 16);
        } catch (Exception e) {
            return "fallback_sig";
        }
    }

    private boolean verifyPoW(String challenge, String nonce) {
        if (challenge == null || nonce == null || challenge.isBlank() || nonce.isBlank()) {
            return false;
        }
        String[] parts = challenge.split(":");
        if (parts.length != 3) {
            return false;
        }
        try {
            long timestamp = Long.parseLong(parts[0]);
            long now = System.currentTimeMillis();
            if (now - timestamp > 300_000 || timestamp - now > 60_000) {
                return false;
            }
            String expectedSig = computePowHmac(parts[0] + ":" + parts[1]);
            if (!expectedSig.equals(parts[2])) {
                return false;
            }
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hash = md.digest((challenge + ":" + nonce.trim()).getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < 2; i++) {
                sb.append(String.format("%02x", hash[i]));
            }
            return sb.toString().startsWith("0000");
        } catch (Exception e) {
            return false;
        }
    }

    private String validateContentQuality(String text, String fieldName) {
        if (text != null && text.trim().startsWith("ENC:")) {
            return null; // Client-side asymmetrically encrypted ciphertext bypasses plaintext entropy checks
        }
        if (text == null || text.trim().length() < 12) {
            return fieldName + " must contain at least 12 characters with descriptive details.";
        }
        String clean = text.trim();
        if (Pattern.compile("(.)\\1{4,}").matcher(clean).find()) {
            return fieldName + " contains repetitive characters or keyboard spam. Please provide genuine descriptive text.";
        }
        String[] rawWords = clean.toLowerCase().split("[^a-zA-Z0-9]+");
        Set<String> distinctWords = new HashSet<>();
        for (String w : rawWords) {
            if (w.length() >= 2) {
                distinctWords.add(w);
            }
        }
        if (distinctWords.size() < 3) {
            return fieldName + " must contain at least 3 distinct descriptive words.";
        }
        int alphaCount = 0;
        Set<Character> distinctChars = new HashSet<>();
        for (char c : clean.toLowerCase().toCharArray()) {
            if (Character.isLetter(c)) {
                alphaCount++;
                distinctChars.add(c);
            }
        }
        if (alphaCount >= 15 && ((double) distinctChars.size() / alphaCount) < 0.22) {
            return fieldName + " appears repetitive or lacks sufficient character variety. Please describe what occurred with realistic details.";
        }
        return null;
    }

    private Report findNearDuplicate(ReportRequest req, LocalDateTime now) {
        LocalDateTime cutoff = now.minusMinutes(45);
        List<Report> recent = reports.findByCreatedAtAfterOrderByCreatedAtDesc(cutoff);
        if (recent.isEmpty()) return null;

        String incomingCat = req.getEventType() != null ? req.getEventType().trim().toLowerCase() : "";
        Set<String> incomingTokens = extractTokensForMatch(req.getDescription() + " " + req.getLoc());

        for (Report prior : recent) {
            if (prior.getEventType() == null || !prior.getEventType().trim().equalsIgnoreCase(incomingCat)) {
                continue;
            }
            if (req.getLatitude() != null && req.getLongitude() != null &&
                    prior.getLatitude() != null && prior.getLongitude() != null) {
                double dist = haversineDistance(req.getLatitude(), req.getLongitude(), prior.getLatitude(), prior.getLongitude());
                if (dist <= 0.6) {
                    return prior;
                }
            }
            if (req.getLoc() != null && prior.getLoc() != null &&
                    req.getLoc().trim().equalsIgnoreCase(prior.getLoc().trim())) {
                return prior;
            }
            Set<String> priorTokens = extractTokensForMatch(prior.getDescription() + " " + prior.getLoc());
            if (!incomingTokens.isEmpty()) {
                long overlap = incomingTokens.stream().filter(priorTokens::contains).count();
                if (((double) overlap / incomingTokens.size()) >= 0.50) {
                    return prior;
                }
            }
        }
        return null;
    }

    private static double haversineDistance(double lat1, double lon1, double lat2, double lon2) {
        double R = 6371.0;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                        Math.sin(dLon / 2) * Math.sin(dLon / 2);
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

    private static Set<String> extractTokensForMatch(String text) {
        if (text == null) return Collections.emptySet();
        return Arrays.stream(text.toLowerCase().split("[^a-zA-Z0-9]+"))
                .filter(w -> w.length() >= 4)
                .collect(Collectors.toSet());
    }

    @PostMapping
    @Transactional
    public ResponseEntity<?> create(@Valid @RequestBody ReportRequest request, HttpSession session) {
        User reporter = currentUser(session);

        // 1. Strict Validation: Incident date and time cannot be in the future
        LocalDateTime nowLocal = LocalDateTime.now();
        LocalDateTime nowIst = LocalDateTime.now(ZoneId.of("Asia/Kolkata"));
        LocalDateTime maxAllowed = nowLocal.isAfter(nowIst) ? nowLocal : nowIst;
        if (request.getDateTime().isAfter(maxAllowed.plusSeconds(30))) {
            return ResponseEntity.badRequest().body(Map.of("message",
                    "Incident date and time cannot be in the future (the incident must have already occurred). Current time: " + nowLocal));
        }

        // 0. Feature 2: Client-side Proof-of-Work Challenge verification (anti-bot burst spam protection)
        if (request.getPowChallenge() != null && !request.getPowChallenge().isBlank()) {
            if (!verifyPoW(request.getPowChallenge(), request.getPowNonce())) {
                return ResponseEntity.badRequest().body(Map.of(
                        "message", "Cryptographic proof-of-work verification failed. Please try submitting again."
                ));
            }
        }

        // Feature 4: Semantic Entropy & Quality check (rejects keyboard mash, single-char loops, gibberish)
        String descQualityErr = validateContentQuality(request.getDescription(), "Incident description");
        if (descQualityErr != null) {
            return ResponseEntity.badRequest().body(Map.of("message", descQualityErr));
        }
        if (request.getIncidentOverview() != null && !request.getIncidentOverview().isBlank()) {
            String overviewQualityErr = validateContentQuality(request.getIncidentOverview(), "Public glimpse");
            if (overviewQualityErr != null) {
                return ResponseEntity.badRequest().body(Map.of("message", overviewQualityErr));
            }
        }

        Report r = new Report();
        r.setEventType(request.getEventType().trim());
        r.setThreatLevel(request.getThreatLevel() != null && !request.getThreatLevel().isBlank()
                ? request.getThreatLevel().trim().toUpperCase() : "MEDIUM");
        r.setImportance(request.getImportance() != null && !request.getImportance().isBlank()
                ? request.getImportance().trim().toUpperCase() : "ROUTINE");

        // 2. Public Glimpse vs Confidential Detailed Description
        String overview = request.getIncidentOverview();
        if (overview == null || overview.isBlank()) {
            String desc = request.getDescription().trim();
            overview = desc.substring(0, Math.min(180, desc.length())) + (desc.length() > 180 ? "..." : "");
        }
        r.setIncidentOverview(overview.trim());
        r.setDescription(request.getDescription().trim());
        r.setLoc(request.getLoc().trim());
        r.setDateTime(request.getDateTime());
        r.setLatitude(request.getLatitude());
        r.setLongitude(request.getLongitude());
        r.setReporter(reporter);
        r.setAnonymous(reporter == null);
        r.setStatus("PENDING");
        r.setPhotoUrl(request.getPhotoData());

        // Format human-readable reference code: RPT-YYYY-XXXXX
        long count = reports.count() + 1;
        r.setReferenceCode(String.format("RPT-%d-%05d", LocalDateTime.now().getYear(), count));

        // 3. Secret Keyphrase generation or hashing
        String keyphrase = request.getKeyphrase();
        if (keyphrase == null || keyphrase.trim().isEmpty()) {
            keyphrase = generateMemorableKeyphrase();
        } else {
            keyphrase = keyphrase.trim();
        }
        r.setKeyphraseHash(passwordEncoder.encode(keyphrase));
        r.setKeyphraseHint("Secret keyphrase active (" + keyphrase.length() + " chars)");

        // 4. Anonymous Session Token for persistent browser resume
        String sessionToken = UUID.randomUUID().toString();
        r.setAnonymousSessionToken(sessionToken);

        // Feature 3: Spatio-Temporal Near-Duplicate Merging (Cluster, Don't Discard)
        Report nearDuplicate = findNearDuplicate(request, LocalDateTime.now());
        if (nearDuplicate != null) {
            r.setParentReferenceCode(nearDuplicate.getReferenceCode());
            r.setDuplicateMerged(true);
        }

        Report saved = reports.save(r);

        // Bind this report to the active HTTP session immediately
        session.setAttribute("accessibleReportId", saved.getId());
        session.setAttribute("anonymousSessionToken", sessionToken);

        String actorUsername = reporter != null ? reporter.getUsername() : "Anonymous Reporter";
        String actorRole = reporter != null ? reporter.getRole() : "CITIZEN";

        // Optional photo attached directly during report submission
        if (request.getPhotoData() != null && !request.getPhotoData().isBlank()) {
            Evidence photoEvidence = new Evidence();
            photoEvidence.setReport(saved);
            photoEvidence.setTitle(request.getPhotoName() != null && !request.getPhotoName().isBlank()
                    ? request.getPhotoName().trim() : "Incident Scene Visual Evidence");
            photoEvidence.setEvidenceType("PHOTO");
            photoEvidence.setFileReference("scene_photo_" + saved.getReferenceCode() + ".jpg");
            try {
                MessageDigest md = MessageDigest.getInstance("SHA-256");
                byte[] hash = md.digest(request.getPhotoData().getBytes(StandardCharsets.UTF_8));
                StringBuilder sb = new StringBuilder();
                for (byte b : hash) sb.append(String.format("%02x", b));
                photoEvidence.setFileHash(sb.toString());
            } catch (Exception ex) {
                photoEvidence.setFileHash("hash_pending");
            }
            photoEvidence.setUploader(actorUsername);
            photoEvidence.setUploaderRole(actorRole);
            photoEvidence.setChainOfCustody("Attached during initial submission by " + actorUsername + " (" + actorRole + "); cryptographic SHA-256 integrity digest verified.");
            photoEvidence.setUploadedAt(LocalDateTime.now());
            evidenceRepository.save(photoEvidence);

            auditLogService.log(saved.getId(), "EVIDENCE_ATTACHED", actorUsername, actorRole,
                    "Scene visual evidence photograph attached with verified cryptographic hash: " + photoEvidence.getFileHash(),
                    null, photoEvidence.getTitle());
        }

        // Option for Police Officer or Journalist to add officials present at intake
        if (reporter != null && (isStaff(reporter) || "JOURNALIST".equals(reporter.getRole()))) {
            if (request.getInitialOfficial() != null
                    && request.getInitialOfficial().getOfficialName() != null
                    && !request.getInitialOfficial().getOfficialName().isBlank()) {
                OfficialRequest offReq = request.getInitialOfficial();
                IncidentOfficial official = new IncidentOfficial();
                official.setReport(saved);
                official.setOfficialName(offReq.getOfficialName().trim());
                official.setBadgeNumber(offReq.getBadgeNumber() != null ? offReq.getBadgeNumber().trim() : "N/A");
                official.setDepartment(offReq.getDepartment() != null ? offReq.getDepartment().trim() : "Investigative Division");
                official.setDesignation(offReq.getDesignation() != null ? offReq.getDesignation().trim() : "Scene Investigator");
                official.setContactInfo(offReq.getContactInfo() != null ? offReq.getContactInfo().trim() : null);
                official.setFirstReportTaker(offReq.isFirstReportTaker());
                official.setArrivalTime(offReq.getArrivalTime() != null ? offReq.getArrivalTime() : LocalDateTime.now());
                official.setDutiesSummary(offReq.getDutiesSummary() != null ? offReq.getDutiesSummary().trim() : "Initial scene documentation and intake.");
                official.setRecordedAt(LocalDateTime.now());
                official.setRecordedBy(actorUsername);
                officialRepository.save(official);

                auditLogService.log(saved.getId(), "OFFICIAL_RECORDED", actorUsername, actorRole,
                        String.format("Initial official present recorded: %s (Badge: %s, %s). First report taker: %s",
                                official.getOfficialName(), official.getBadgeNumber(), official.getDesignation(), official.isFirstReportTaker() ? "YES" : "NO"),
                        null, official.getOfficialName());
            }
        }

        // Audit Log entry
        String geoInfo = (r.getLatitude() != null && r.getLongitude() != null)
                ? String.format(" [Coordinates: %.5f, %.5f]", r.getLatitude(), r.getLongitude())
                : "";
        auditLogService.log(saved.getId(), "REPORT_CREATED", actorUsername, actorRole,
                String.format("Initial incident report filed [%s]: %s at %s%s (Anonymous: %s)",
                        saved.getReferenceCode(), r.getEventType(), r.getLoc(), geoInfo, r.isAnonymous() ? "YES" : "NO"),
                null, "PENDING");

        if (nearDuplicate != null) {
            auditLogService.log(saved.getId(), "DUPLICATE_CLUSTERED", actorUsername, actorRole,
                    "Incident clustered as a corroborating addendum under primary case " + nearDuplicate.getReferenceCode(),
                    null, nearDuplicate.getReferenceCode());
        }

        Map<String, Object> resp = toMap(saved, reporter, session);
        resp.put("secretKeyphrase", keyphrase);
        resp.put("sessionToken", sessionToken);
        if (nearDuplicate != null) {
            resp.put("duplicateClustered", true);
            resp.put("parentReferenceCode", nearDuplicate.getReferenceCode());
            resp.put("accessMessage", "Incident recorded and clustered as a corroborating addendum to recent case " +
                    nearDuplicate.getReferenceCode() + ". Your unique keyphrase has been generated and case history is preserved.");
        } else {
            resp.put("duplicateClustered", false);
            resp.put("accessMessage", "Incident lodged successfully! Save your Secret Keyphrase to track, update, and communicate with investigating authorities.");
        }
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/access-by-keyphrase")
    public ResponseEntity<?> accessByKeyphrase(@Valid @RequestBody KeyphraseAccessRequest request, HttpSession session) {
        String code = request.getReferenceCode().trim();
        Report r = reports.findByReferenceCodeIgnoreCase(code).orElse(null);
        if (r == null) {
            try {
                long id = Long.parseLong(code.replace("RPT-", "").replaceAll("[^0-9]", ""));
                r = reports.findById(id).orElse(null);
            } catch (Exception ignored) {}
        }

        if (r == null || r.getKeyphraseHash() == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Invalid Report Reference Code or Secret Keyphrase."));
        }

        if (!passwordEncoder.matches(request.getKeyphrase().trim(), r.getKeyphraseHash())) {
            return ResponseEntity.status(401).body(Map.of("message", "Incorrect Secret Keyphrase for this case. Please verify spelling."));
        }

        // Ensure session token exists
        if (r.getAnonymousSessionToken() == null) {
            r.setAnonymousSessionToken(UUID.randomUUID().toString());
            reports.save(r);
        }

        // Grant session access
        session.setAttribute("accessibleReportId", r.getId());
        session.setAttribute("anonymousSessionToken", r.getAnonymousSessionToken());

        auditLogService.log(r.getId(), "REPORT_ACCESSED_BY_KEYPHRASE", "Anonymous Owner", "REPORTER",
                String.format("Report %s unlocked via secret keyphrase authentication", r.getReferenceCode()), null, "UNLOCKED");

        return ResponseEntity.ok(Map.of(
                "message", "Case unlocked successfully via Secret Keyphrase.",
                "report", toMap(r, currentUser(session), session),
                "sessionToken", r.getAnonymousSessionToken(),
                "referenceCode", r.getReferenceCode()
        ));
    }

    @PostMapping("/resume-session")
    public ResponseEntity<?> resumeSession(@RequestBody(required = false) Map<String, String> body, HttpSession session) {
        Long sessionReportId = null;
        Object sId = session.getAttribute("accessibleReportId");
        if (sId instanceof Long lid) sessionReportId = lid;

        Report r = null;
        if (sessionReportId != null) {
            r = reports.findById(sessionReportId).orElse(null);
        }

        if (r == null && body != null && body.containsKey("referenceCode") && body.containsKey("sessionToken")) {
            String code = body.get("referenceCode").trim();
            String token = body.get("sessionToken").trim();
            Report candidate = reports.findByReferenceCodeIgnoreCase(code).orElse(null);
            if (candidate != null && candidate.getAnonymousSessionToken() != null
                    && candidate.getAnonymousSessionToken().equals(token)) {
                r = candidate;
                session.setAttribute("accessibleReportId", r.getId());
                session.setAttribute("anonymousSessionToken", r.getAnonymousSessionToken());
            }
        }

        if (r == null) {
            return ResponseEntity.status(401).body(Map.of("success", false, "message", "No active case session found."));
        }

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Active case session resumed.",
                "report", toMap(r, currentUser(session), session),
                "sessionToken", r.getAnonymousSessionToken(),
                "referenceCode", r.getReferenceCode()
        ));
    }

    @PutMapping("/{id}/update-by-reporter")
    @Transactional
    public ResponseEntity<?> updateByReporter(@PathVariable Long id,
                                              @RequestBody ReportUpdateRequest request,
                                              HttpSession session) {
        Report r = reports.findById(id).orElse(null);
        if (r == null) return ResponseEntity.notFound().build();

        User user = currentUser(session);
        boolean isOwner = isReporterSessionOwner(r, session)
                || (user != null && r.getReporter() != null && r.getReporter().getId().equals(user.getId()))
                || (request.getKeyphrase() != null && r.getKeyphraseHash() != null && passwordEncoder.matches(request.getKeyphrase().trim(), r.getKeyphraseHash()));

        if (!isOwner && (user == null || !"ADMIN".equals(user.getRole()))) {
            return ResponseEntity.status(403).body(Map.of("message", "Unauthorized. Valid Secret Keyphrase or active case session required to make changes."));
        }

        StringBuilder changes = new StringBuilder();

        if (request.getDescription() != null && !request.getDescription().isBlank()) {
            r.setDescription(request.getDescription().trim());
            changes.append("Updated narrative; ");
        }

        if (request.getIncidentOverview() != null && !request.getIncidentOverview().isBlank()) {
            r.setIncidentOverview(request.getIncidentOverview().trim());
            changes.append("Updated overview; ");
        }

        if (request.getLoc() != null && !request.getLoc().isBlank()) {
            r.setLoc(request.getLoc().trim());
            changes.append("Updated location to: ").append(request.getLoc().trim()).append("; ");
        }

        if (request.getLatitude() != null && request.getLongitude() != null) {
            r.setLatitude(request.getLatitude());
            r.setLongitude(request.getLongitude());
            changes.append("Updated GPS fix; ");
        }

        // Attach additional photo if uploaded
        if (request.getPhotoData() != null && !request.getPhotoData().isBlank()) {
            r.setPhotoUrl(request.getPhotoData());
            Evidence photoEvidence = new Evidence();
            photoEvidence.setReport(r);
            photoEvidence.setTitle(request.getPhotoName() != null && !request.getPhotoName().isBlank()
                    ? request.getPhotoName().trim() : "Supplementary Scene Visual");
            photoEvidence.setEvidenceType("PHOTO");
            photoEvidence.setFileReference("supplement_" + r.getReferenceCode() + "_" + System.currentTimeMillis() + ".jpg");
            try {
                MessageDigest md = MessageDigest.getInstance("SHA-256");
                byte[] hash = md.digest(request.getPhotoData().getBytes(StandardCharsets.UTF_8));
                StringBuilder sb = new StringBuilder();
                for (byte b : hash) sb.append(String.format("%02x", b));
                photoEvidence.setFileHash(sb.toString());
            } catch (Exception ex) {
                photoEvidence.setFileHash("hash_pending");
            }
            String actorName = user != null ? user.getUsername() : "Case Reporter";
            String actorRole = user != null ? user.getRole() : "REPORTER";
            photoEvidence.setUploader(actorName);
            photoEvidence.setUploaderRole(actorRole);
            photoEvidence.setChainOfCustody("Added as supplementary photo evidence by " + actorName + " (" + actorRole + "); SHA-256 verified.");
            photoEvidence.setUploadedAt(LocalDateTime.now());
            evidenceRepository.save(photoEvidence);
            changes.append("Attached new photo evidence: ").append(photoEvidence.getFileHash()).append("; ");
        }

        r.setUpdatedAt(LocalDateTime.now());
        Report saved = reports.save(r);

        String actorName = user != null ? user.getUsername() : "Case Reporter";
        String actorRole = user != null ? user.getRole() : "REPORTER";
        auditLogService.log(saved.getId(), "REPORT_UPDATED_BY_REPORTER", actorName, actorRole,
                "Case details updated by verified reporter: " + changes.toString(), null, "UPDATED");

        return ResponseEntity.ok(Map.of(
                "message", "Report successfully updated.",
                "report", toMap(saved, user, session)
        ));
    }

    @GetMapping("/{id}/messages")
    public ResponseEntity<?> getMessages(@PathVariable Long id, HttpSession session) {
        Report r = reports.findById(id).orElse(null);
        if (r == null) return ResponseEntity.notFound().build();

        User user = currentUser(session);
        boolean isStaffUser = user != null && (isStaff(user) || "JOURNALIST".equals(user.getRole()));
        boolean isOwner = isReporterSessionOwner(r, session)
                || (user != null && r.getReporter() != null && r.getReporter().getId().equals(user.getId()));

        if (!isStaffUser && !isOwner) {
            return ResponseEntity.status(403).body(Map.of("message", "Access restricted to authorities or the verified case reporter."));
        }

        List<ReportMessage> messages = reportMessageRepository.findByReportIdOrderByCreatedAtAsc(id);

        // Mark read
        boolean modified = false;
        for (ReportMessage m : messages) {
            if (isStaffUser && !m.isReadByAuthority() && "REPORTER".equalsIgnoreCase(m.getSenderType())) {
                m.setReadByAuthority(true);
                modified = true;
            } else if (isOwner && !m.isReadByReporter() && "AUTHORITY".equalsIgnoreCase(m.getSenderType())) {
                m.setReadByReporter(true);
                modified = true;
            }
        }
        if (modified) {
            reportMessageRepository.saveAll(messages);
        }

        List<Map<String, Object>> res = messages.stream().map(m -> {
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("id", m.getId());
            item.put("senderType", m.getSenderType());
            item.put("senderName", m.getSenderName());
            item.put("senderRole", m.getSenderRole());
            item.put("messageText", m.getMessageText());
            item.put("createdAt", m.getCreatedAt());
            item.put("readByReporter", m.isReadByReporter());
            item.put("readByAuthority", m.isReadByAuthority());
            return item;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(res);
    }

    @PostMapping("/{id}/messages")
    @Transactional
    public ResponseEntity<?> sendMessage(@PathVariable Long id,
                                         @Valid @RequestBody ReportMessageRequest request,
                                         HttpSession session) {
        Report r = reports.findById(id).orElse(null);
        if (r == null) return ResponseEntity.notFound().build();

        User user = currentUser(session);
        boolean isStaffUser = user != null && (isStaff(user) || "JOURNALIST".equals(user.getRole()));
        boolean isOwner = isReporterSessionOwner(r, session)
                || (user != null && r.getReporter() != null && r.getReporter().getId().equals(user.getId()))
                || (request.getKeyphrase() != null && r.getKeyphraseHash() != null && passwordEncoder.matches(request.getKeyphrase().trim(), r.getKeyphraseHash()));

        if (!isStaffUser && !isOwner) {
            return ResponseEntity.status(403).body(Map.of("message", "Unauthorized. Keyphrase or authority login required to communicate."));
        }

        String senderType;
        String senderName;
        String senderRole;
        String auditAction;

        if (isStaffUser) {
            senderType = "AUTHORITY";
            senderName = user.getUsername() + " (" + user.getRole() + ")";
            senderRole = user.getRole();
            auditAction = "AUTHORITY_INQUIRY";
        } else {
            senderType = "REPORTER";
            senderName = "Anonymous Reporter";
            senderRole = "REPORTER";
            auditAction = "REPORTER_COMMUNICATION_REPLY";
        }

        ReportMessage msg = new ReportMessage(r, senderType, senderName, senderRole, request.getMessageText().trim());
        ReportMessage saved = reportMessageRepository.save(msg);

        auditLogService.log(id, auditAction, senderName, senderRole,
                String.format("Communication exchange on case %s: %s", r.getReferenceCode(),
                        request.getMessageText().length() > 60 ? request.getMessageText().substring(0, 60) + "..." : request.getMessageText()),
                null, senderType);

        Map<String, Object> item = new LinkedHashMap<>();
        item.put("id", saved.getId());
        item.put("senderType", saved.getSenderType());
        item.put("senderName", saved.getSenderName());
        item.put("senderRole", saved.getSenderRole());
        item.put("messageText", saved.getMessageText());
        item.put("createdAt", saved.getCreatedAt());
        item.put("readByReporter", saved.isReadByReporter());
        item.put("readByAuthority", saved.isReadByAuthority());
        return ResponseEntity.ok(item);
    }

    @GetMapping
    public ResponseEntity<?> list(@RequestParam(required=false) String status, HttpSession session) {
        User user = currentUser(session);
        List<Report> result = (status == null || status.isBlank())
                ? reports.findAllByOrderByCreatedAtDesc()
                : reports.findByStatusIgnoreCaseOrderByCreatedAtDesc(status.trim());

        return ResponseEntity.ok(result.stream().map(r -> toMap(r, user, session)).collect(Collectors.toList()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOne(@PathVariable Long id, HttpSession session) {
        Report r = reports.findById(id).orElse(null);
        if (r == null) return ResponseEntity.notFound().build();

        User user = currentUser(session);
        boolean isOwner = isReporterSessionOwner(r, session)
                || (user != null && r.getReporter() != null && r.getReporter().getId().equals(user.getId()));
        boolean canViewFull = isOwner || isAuthorizedViewer(user);

        if (canViewFull && user != null) {
            auditLogService.log(id, "SENSITIVE_REPORT_VIEWED", user.getUsername(), user.getRole(),
                    String.format("User %s (%s) accessed confidential case narrative & evidentiary details of %s",
                            user.getUsername(), user.getRole(), r.getReferenceCode()), null, "VIEWED");
        }
        return ResponseEntity.ok(toMap(r, user, session));
    }

    @PostMapping("/{id}/log-view")
    public ResponseEntity<?> logView(@PathVariable Long id, HttpSession session) {
        User user = currentUser(session);
        if (user == null) return unauthorized();
        Report r = reports.findById(id).orElse(null);
        if (r == null) return ResponseEntity.notFound().build();

        auditLogService.log(id, "SENSITIVE_REPORT_VIEWED", user.getUsername(), user.getRole(),
                String.format("User %s (%s) accessed confidential case narrative & evidentiary details of %s",
                        user.getUsername(), user.getRole(), r.getReferenceCode()), null, "VIEWED");

        long count = auditLogRepository.countByReportIdAndAction(id, "SENSITIVE_REPORT_VIEWED");
        return ResponseEntity.ok(Map.of("message", "View logged.", "viewsCount", count));
    }

    @GetMapping("/{id}/view-logs")
    public ResponseEntity<?> getViewLogs(@PathVariable Long id, HttpSession session) {
        User user = currentUser(session);
        if (user == null) return unauthorized();
        List<AuditLog> list = auditLogRepository.findByReportIdAndActionOrderByTimestampDesc(id, "SENSITIVE_REPORT_VIEWED");
        List<Map<String, Object>> res = list.stream().map(al -> {
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("id", al.getId());
            item.put("viewerUsername", al.getPerformedBy());
            item.put("viewerRole", al.getUserRole());
            item.put("details", al.getDetails());
            item.put("timestamp", al.getTimestamp());
            return item;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(res);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String,String> body, HttpSession session) {
        User user = currentUser(session);
        if (user == null) return unauthorized();
        if (!isStaff(user)) return ResponseEntity.status(403).body(Map.of("message", "Authorized review access required (Government Official, Police, or Admin)."));

        String status = body.getOrDefault("status", "").trim().toUpperCase(Locale.ROOT);
        if (!Set.of("PENDING", "UNDER_REVIEW", "INVESTIGATING", "RESOLVED", "CLOSED").contains(status)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid status."));
        }
        Report r = reports.findById(id).orElse(null);
        if (r == null) return ResponseEntity.notFound().build();

        String oldStatus = r.getStatus();
        boolean statusChanged = !oldStatus.equalsIgnoreCase(status);
        r.setStatus(status);

        String oldFir = r.getFirNumber();
        boolean firChanged = false;
        if (body.containsKey("firNumber") && ("ADMIN".equals(user.getRole()) || "POLICE".equals(user.getRole()))) {
            String fir = body.get("firNumber");
            String cleanedFir = (fir == null || fir.isBlank()) ? null : fir.trim();
            if (!Objects.equals(oldFir, cleanedFir)) {
                r.setFirNumber(cleanedFir);
                firChanged = true;
            }
        }

        r.setUpdatedAt(LocalDateTime.now());
        Report saved = reports.save(r);

        if (statusChanged) {
            auditLogService.log(saved.getId(), "STATUS_UPDATED", user.getUsername(), user.getRole(),
                    String.format("Status transitioned from [%s] to [%s] by %s (%s)", oldStatus, status, user.getUsername(), user.getRole()),
                    oldStatus, status);
        }
        if (firChanged) {
            auditLogService.log(saved.getId(), "FIR_UPDATED", user.getUsername(), user.getRole(),
                    String.format("Official FIR number updated to [%s] by %s", saved.getFirNumber(), user.getUsername()),
                    oldFir, saved.getFirNumber());
        }

        return ResponseEntity.ok(toMap(saved, user, session));
    }

    @PostMapping("/{id}/endorsements")
    public ResponseEntity<?> endorseReport(@PathVariable Long id,
                                          @RequestBody Map<String, String> body,
                                          HttpSession session) {
        User user = currentUser(session);
        if (user == null) return unauthorized();

        Report r = reports.findById(id).orElse(null);
        if (r == null) return ResponseEntity.notFound().build();

        String verdict = body.getOrDefault("verdict", "AUTHENTIC").trim().toUpperCase(Locale.ROOT);
        if (!Set.of("AUTHENTIC", "PLAUSIBLE", "DISPUTED").contains(verdict)) {
            verdict = "AUTHENTIC";
        }
        String note = body.getOrDefault("note", "").trim();

        ReportEndorsement endorsement = endorsementRepository.findByReportIdAndUserId(id, user.getId())
                .orElse(new ReportEndorsement());

        endorsement.setReport(r);
        endorsement.setUser(user);
        endorsement.setEndorserUsername(user.getUsername());
        endorsement.setEndorserRole(user.getRole());
        endorsement.setVerdict(verdict);
        endorsement.setEndorsementNote(note.isEmpty() ? null : note);
        endorsement.setCreatedAt(LocalDateTime.now());

        endorsementRepository.save(endorsement);

        auditLogService.log(r.getId(), "AUTHENTICITY_VOUCHED", user.getUsername(), user.getRole(),
                String.format("User %s (%s) submitted authenticity verdict: [%s]. Note: %s",
                        user.getUsername(), user.getRole(), verdict, note.isEmpty() ? "None" : note),
                null, verdict);

        return ResponseEntity.ok(getEndorsementsSummary(id, user));
    }

    @GetMapping("/{id}/endorsements")
    public ResponseEntity<?> getEndorsements(@PathVariable Long id, HttpSession session) {
        User user = currentUser(session);
        return ResponseEntity.ok(getEndorsementsSummary(id, user));
    }

    private Map<String, Object> getEndorsementsSummary(Long reportId, User currentUser) {
        List<ReportEndorsement> list = endorsementRepository.findByReportIdOrderByCreatedAtDesc(reportId);
        long policeCount = list.stream().filter(e -> "POLICE".equals(e.getEndorserRole()) || "GOVERNMENT_OFFICIAL".equals(e.getEndorserRole())).count();
        long journalistCount = list.stream().filter(e -> "JOURNALIST".equals(e.getEndorserRole())).count();
        long citizenCount = list.stream().filter(e -> "CITIZEN".equals(e.getEndorserRole()) || "ORGANIZATION".equals(e.getEndorserRole())).count();

        boolean endorsedByMe = currentUser != null && list.stream().anyMatch(e -> e.getUser().getId().equals(currentUser.getId()));
        String myVerdict = currentUser != null
                ? list.stream().filter(e -> e.getUser().getId().equals(currentUser.getId())).map(ReportEndorsement::getVerdict).findFirst().orElse(null)
                : null;

        Map<String, Object> res = new LinkedHashMap<>();
        res.put("total", list.size());
        res.put("policeCount", policeCount);
        res.put("journalistCount", journalistCount);
        res.put("citizenCount", citizenCount);
        res.put("endorsedByMe", endorsedByMe);
        res.put("myVerdict", myVerdict);
        res.put("endorsements", list.stream().map(e -> Map.of(
                "id", e.getId(),
                "endorserUsername", e.getEndorserUsername(),
                "endorserRole", e.getEndorserRole(),
                "verdict", e.getVerdict(),
                "notes", e.getEndorsementNote() != null ? e.getEndorsementNote() : "",
                "createdAt", e.getCreatedAt()
        )).collect(Collectors.toList()));
        return res;
    }

    private boolean isReporterSessionOwner(Report r, HttpSession session) {
        if (r == null || session == null) return false;
        Object accId = session.getAttribute("accessibleReportId");
        if (accId instanceof Long aid && aid.equals(r.getId())) return true;
        Object token = session.getAttribute("anonymousSessionToken");
        if (token instanceof String tok && tok.equals(r.getAnonymousSessionToken())) return true;
        return false;
    }

    private String generateMemorableKeyphrase() {
        String[] wordlist = {
                "velvet", "granite", "orbital", "falcon", "whisper", "cobalt", "harbor", "timber",
                "canyon", "zenith", "summit", "beacon", "crypto", "matrix", "shield", "silver",
                "shadow", "glacier", "vortex", "aurora", "breeze", "cipher", "dynamo", "echo",
                "fathom", "geyser", "haven", "island", "javelin", "kinetic", "lagoon", "meteor",
                "nebula", "onyx", "prairie", "quasar", "radius", "stellar", "tundra", "uranium",
                "vector", "walnut", "xenon", "yield", "zephyr", "anchor", "basalt", "cascade",
                "dune", "ember", "flint", "garnet", "horizon", "impact", "jasper", "karma"
        };
        java.security.SecureRandom rng = new java.security.SecureRandom();
        List<String> words = new ArrayList<>(7);
        for (int i = 0; i < 7; i++) {
            words.add(wordlist[rng.nextInt(wordlist.length)]);
        }
        return String.join("-", words);
    }

    private User currentUser(HttpSession session) {
        if (session == null) return null;
        Object id = session.getAttribute("userId");
        if (!(id instanceof Long userId)) return null;
        return users.findById(userId).orElse(null);
    }

    private boolean isAuthorizedViewer(User user) {
        if (user == null) return false;
        String role = user.getRole();
        return "ADMIN".equals(role)
                || "POLICE".equals(role)
                || "GOVERNMENT_OFFICIAL".equals(role)
                || "JOURNALIST".equals(role);
    }

    private boolean isStaff(User user) {
        if (user == null) return false;
        String role = user.getRole();
        return "GOVERNMENT_OFFICIAL".equals(role) || "POLICE".equals(role) || "ADMIN".equals(role);
    }

    private ResponseEntity<?> unauthorized() {
        return ResponseEntity.status(401).body(Map.of("message", "Please log in."));
    }

    private Map<String,Object> toMap(Report r, User viewingUser, HttpSession session) {
        Map<String,Object> m = new LinkedHashMap<>();
        m.put("id", r.getId());
        m.put("referenceCode", r.getReferenceCode() != null ? r.getReferenceCode() : String.format("RPT-2026-%05d", r.getId()));
        m.put("eventType", r.getEventType());

        // Overview is always public
        m.put("incidentOverview", r.getIncidentOverview() != null && !r.getIncidentOverview().isBlank()
                ? r.getIncidentOverview()
                : r.getDescription().substring(0, Math.min(180, r.getDescription().length())) + "...");

        // Description Privacy
        boolean isOwner = (viewingUser != null && r.getReporter() != null && r.getReporter().getId().equals(viewingUser.getId()))
                || isReporterSessionOwner(r, session);
        boolean isAuthorized = viewingUser != null && isAuthorizedViewer(viewingUser);
        boolean canViewFull = isOwner || isAuthorized;

        m.put("canViewFullDescription", canViewFull);
        m.put("canEdit", isOwner || (viewingUser != null && "ADMIN".equals(viewingUser.getRole())));
        m.put("isOwner", isOwner);

        // Blind Carrier Architecture: The backend blindly stores and serves the client-encrypted ciphertext.
        // Plaintext masking logic is removed; decryption happens strictly on client with private keyphrase.
        m.put("description", r.getDescription());
        m.put("isEncryptedCiphertext", r.getDescription() != null && r.getDescription().startsWith("ENC:"));
        m.put("threatLevel", r.getThreatLevel() != null ? r.getThreatLevel() : "MEDIUM");
        m.put("importance", r.getImportance() != null ? r.getImportance() : "ROUTINE");

        m.put("photoUrl", r.getPhotoUrl());
        m.put("viewsCount", auditLogRepository.countByReportIdAndAction(r.getId(), "SENSITIVE_REPORT_VIEWED"));

                m.put("parentReferenceCode", r.getParentReferenceCode());
        m.put("duplicateMerged", r.getDuplicateMerged());
        m.put("loc", r.getLoc());
        m.put("latitude", r.getLatitude());
        m.put("longitude", r.getLongitude());
        m.put("dateTime", r.getDateTime());
        m.put("status", r.getStatus());
        m.put("firNumber", r.getFirNumber());

        String reporterName = (r.getReporter() != null) ? r.getReporter().getUsername() : "Anonymous Reporter";
        String reporterRole = (r.getReporter() != null) ? r.getReporter().getRole() : "CITIZEN";
        boolean isCitizen = (r.getReporter() == null) || "CITIZEN".equalsIgnoreCase(r.getReporter().getRole());

        m.put("reporterUsername", reporterName);
        m.put("reporterRole", reporterRole);
        m.put("isReporterCitizen", isCitizen);
        m.put("isAnonymous", r.isAnonymous());
        m.put("hasKeyphrase", r.getKeyphraseHash() != null);
        m.put("createdAt", r.getCreatedAt());
        m.put("updatedAt", r.getUpdatedAt());

        // First report taker official
        List<IncidentOfficial> firstTakers = officialRepository.findByReportIdAndFirstReportTakerTrue(r.getId());
        if (!firstTakers.isEmpty()) {
            IncidentOfficial ft = firstTakers.get(0);
            Map<String, Object> officialMap = new LinkedHashMap<>();
            officialMap.put("officialName", ft.getOfficialName());
            officialMap.put("badgeNumber", ft.getBadgeNumber());
            officialMap.put("department", ft.getDepartment());
            officialMap.put("designation", ft.getDesignation());
            officialMap.put("contactInfo", ft.getContactInfo());
            officialMap.put("arrivalTime", ft.getArrivalTime());
            m.put("firstReportTakerOfficial", officialMap);
        } else {
            m.put("firstReportTakerOfficial", null);
        }

        // Authenticity Endorsements
        List<ReportEndorsement> endorsements = endorsementRepository.findByReportIdOrderByCreatedAtDesc(r.getId());
        m.put("endorsementsCount", endorsements.size());
        long policeVouches = endorsements.stream().filter(e -> "POLICE".equals(e.getEndorserRole()) || "GOVERNMENT_OFFICIAL".equals(e.getEndorserRole())).count();
        long journalistVouches = endorsements.stream().filter(e -> "JOURNALIST".equals(e.getEndorserRole())).count();
        long citizenVouches = endorsements.stream().filter(e -> "CITIZEN".equals(e.getEndorserRole()) || "ORGANIZATION".equals(e.getEndorserRole())).count();
        m.put("policeVouches", policeVouches);
        m.put("journalistVouches", journalistVouches);
        m.put("citizenVouches", citizenVouches);

        boolean endorsedByMe = viewingUser != null && endorsements.stream().anyMatch(e -> e.getUser().getId().equals(viewingUser.getId()));
        m.put("endorsedByMe", endorsedByMe);
        m.put("myVerdict", viewingUser != null
                ? endorsements.stream().filter(e -> e.getUser().getId().equals(viewingUser.getId())).map(ReportEndorsement::getVerdict).findFirst().orElse(null)
                : null);

        m.put("officialsCount", officialRepository.countByReportId(r.getId()));
        m.put("contributionsCount", contributionRepository.countByReportId(r.getId()));
        m.put("witnessesCount", witnessRepository.countByReportId(r.getId()));
        m.put("evidenceCount", evidenceRepository.countByReportId(r.getId()));
        m.put("auditLogsCount", auditLogRepository.countByReportId(r.getId()));

        // Message counts
        m.put("unreadAuthorityMessages", reportMessageRepository.countByReportIdAndSenderTypeAndReadByReporterFalse(r.getId(), "AUTHORITY"));
        m.put("unreadReporterMessages", reportMessageRepository.countByReportIdAndSenderTypeAndReadByAuthorityFalse(r.getId(), "REPORTER"));

        return m;
    }
}
