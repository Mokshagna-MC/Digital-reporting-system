package com.example.backend.controller;

import com.example.backend.dto.ContributionRequest;
import com.example.backend.model.Report;
import com.example.backend.model.ReportContribution;
import com.example.backend.model.User;
import com.example.backend.repository.ReportContributionRepository;
import com.example.backend.repository.ReportRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.AuditLogService;
import com.example.backend.service.ConfidenceEvaluationService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class ContributionController {

    private final ReportContributionRepository contributionRepository;
    private final ReportRepository reports;
    private final UserRepository users;
    private final ConfidenceEvaluationService confidenceService;
    private final AuditLogService auditLogService;

    public ContributionController(ReportContributionRepository contributionRepository,
                                  ReportRepository reports,
                                  UserRepository users,
                                  ConfidenceEvaluationService confidenceService,
                                  AuditLogService auditLogService) {
        this.contributionRepository = contributionRepository;
        this.reports = reports;
        this.users = users;
        this.confidenceService = confidenceService;
        this.auditLogService = auditLogService;
    }

    @PostMapping("/reports/{id}/contributions")
    public ResponseEntity<?> addContribution(@PathVariable Long id,
                                             @Valid @RequestBody ContributionRequest request,
                                             HttpSession session) {
        User user = currentUser(session);
        if (user == null) return unauthorized();

        Report report = reports.findById(id).orElse(null);
        if (report == null) return ResponseEntity.notFound().build();

        ConfidenceEvaluationService.ConfidenceResult eval = confidenceService.evaluate(
                report,
                request.getInfoText(),
                request.getContributorLoc(),
                request.getLatitude(),
                request.getLongitude()
        );

        ReportContribution contrib = new ReportContribution();
        contrib.setReport(report);
        contrib.setContributor(user);
        contrib.setContributorUsername(user.getUsername());
        contrib.setInfoText(request.getInfoText().trim());
        contrib.setContributorLoc(request.getContributorLoc() != null ? request.getContributorLoc().trim() : null);
        contrib.setLatitude(request.getLatitude());
        contrib.setLongitude(request.getLongitude());
        contrib.setDistanceKm(eval.getDistanceKm());
        contrib.setConfidenceScore(eval.getScore());
        contrib.setConfidenceLevel(eval.getLevel());
        contrib.setMatchNotes(eval.getMatchNotes());
        contrib.setStatus("PENDING_REVIEW");
        contrib.setCreatedAt(LocalDateTime.now());

        ReportContribution saved = contributionRepository.save(contrib);

        // Record Audit Log
        String auditDetail = String.format("Community update added by %s (%s). Confidence: %d%% (%s). Notes: %s",
                user.getUsername(), user.getRole(), eval.getScore(), eval.getLevel(), eval.getMatchNotes());

        auditLogService.log(id, "COMMUNITY_INFO_ADDED", user.getUsername(), user.getRole(),
                auditDetail, null, eval.getLevel() + " (" + eval.getScore() + "%)");

        return ResponseEntity.ok(toMap(saved));
    }

    @GetMapping("/reports/{id}/contributions")
    public ResponseEntity<?> getReportContributions(@PathVariable Long id, HttpSession session) {
        User user = currentUser(session);
        if (user == null) return unauthorized();

        Report report = reports.findById(id).orElse(null);
        if (report == null) return ResponseEntity.notFound().build();

        List<ReportContribution> list = contributionRepository.findByReportIdOrderByCreatedAtDesc(id);
        return ResponseEntity.ok(list.stream().map(this::toMap).collect(Collectors.toList()));
    }

    @GetMapping("/contributions")
    public ResponseEntity<?> getAllContributions(HttpSession session) {
        User user = currentUser(session);
        if (user == null) return unauthorized();
        if (!isStaff(user)) {
            return ResponseEntity.status(403).body(Map.of("message", "Police/Admin access required."));
        }
        List<ReportContribution> list = contributionRepository.findAllByOrderByCreatedAtDesc();
        return ResponseEntity.ok(list.stream().map(this::toMap).collect(Collectors.toList()));
    }

    @PatchMapping("/contributions/{id}/status")
    public ResponseEntity<?> updateContributionStatus(@PathVariable Long id,
                                                      @RequestBody Map<String, String> body,
                                                      HttpSession session) {
        User user = currentUser(session);
        if (user == null) return unauthorized();
        if (!isStaff(user)) {
            return ResponseEntity.status(403).body(Map.of("message", "Police/Admin access required."));
        }

        String newStatus = body.getOrDefault("status", "").trim().toUpperCase(Locale.ROOT);
        if (!Set.of("PENDING_REVIEW", "ACCEPTED", "VERIFIED", "FLAGGED", "REJECTED").contains(newStatus)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid contribution status."));
        }

        ReportContribution contrib = contributionRepository.findById(id).orElse(null);
        if (contrib == null) return ResponseEntity.notFound().build();

        String oldStatus = contrib.getStatus();
        contrib.setStatus(newStatus);
        ReportContribution saved = contributionRepository.save(contrib);

        auditLogService.log(saved.getReport().getId(), "CONTRIBUTION_STATUS_UPDATED",
                user.getUsername(), user.getRole(),
                "Contribution #" + id + " marked as " + newStatus + " by " + user.getUsername(),
                oldStatus, newStatus);

        return ResponseEntity.ok(toMap(saved));
    }

    @GetMapping("/reports/nearby")
    public ResponseEntity<?> findNearbyOrMatchingReports(
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false) Double lng,
            @RequestParam(required = false, defaultValue = "25.0") Double radiusKm,
            @RequestParam(required = false) String query,
            HttpSession session) {
        User user = currentUser(session);
        if (user == null) return unauthorized();

        List<Report> all = reports.findAllByOrderByCreatedAtDesc();
        List<Map<String, Object>> matches = new ArrayList<>();

        for (Report r : all) {
            Double dist = null;
            boolean geoMatch = false;

            if (lat != null && lng != null && r.getLatitude() != null && r.getLongitude() != null) {
                dist = ConfidenceEvaluationService.haversine(lat, lng, r.getLatitude(), r.getLongitude());
                dist = Math.round(dist * 100.0) / 100.0;
                if (dist <= radiusKm) {
                    geoMatch = true;
                }
            }

            boolean textMatch = false;
            if (query != null && !query.isBlank()) {
                String q = query.trim().toLowerCase();
                String searchable = (r.getEventType() + " " + r.getDescription() + " " + r.getLoc()).toLowerCase();
                textMatch = searchable.contains(q);
            }

            // Include if lat/lng matched, or text matched, or if no filter was given return recent
            if (geoMatch || textMatch || (lat == null && (query == null || query.isBlank()))) {
                Map<String, Object> item = new LinkedHashMap<>();
                item.put("id", r.getId());
                item.put("eventType", r.getEventType());
                item.put("incidentOverview", r.getIncidentOverview() != null && !r.getIncidentOverview().isBlank()
                        ? r.getIncidentOverview()
                        : r.getDescription().substring(0, Math.min(180, r.getDescription().length())) + "...");
                item.put("description", "[Confidential Detailed Narrative — Protected to maintain witness statement independence]");
                item.put("loc", r.getLoc());
                item.put("dateTime", r.getDateTime());
                item.put("status", r.getStatus());
                item.put("distanceKm", dist);
                item.put("latitude", r.getLatitude());
                item.put("longitude", r.getLongitude());
                item.put("createdAt", r.getCreatedAt());
                matches.add(item);
            }
        }

        // Sort by distance if available, otherwise by creation date
        if (lat != null && lng != null) {
            matches.sort(Comparator.comparing(
                    m -> m.get("distanceKm") != null ? (Double) m.get("distanceKm") : 999999.0
            ));
        }

        return ResponseEntity.ok(matches);
    }

    private User currentUser(HttpSession session) {
        Object id = session.getAttribute("userId");
        if (!(id instanceof Long userId)) return null;
        return users.findById(userId).orElse(null);
    }

    private boolean isStaff(User user) {
        return "POLICE".equals(user.getRole()) || "ADMIN".equals(user.getRole()) || "GOVERNMENT_OFFICIAL".equals(user.getRole()) || "JOURNALIST".equals(user.getRole());
    }

    private ResponseEntity<?> unauthorized() {
        return ResponseEntity.status(401).body(Map.of("message", "Please log in."));
    }

    private Map<String, Object> toMap(ReportContribution c) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", c.getId());
        m.put("reportId", c.getReport().getId());
        m.put("reportEventType", c.getReport().getEventType());
        m.put("contributorUsername", c.getContributorUsername());
        m.put("infoText", c.getInfoText());
        m.put("contributorLoc", c.getContributorLoc());
        m.put("latitude", c.getLatitude());
        m.put("longitude", c.getLongitude());
        m.put("distanceKm", c.getDistanceKm());
        m.put("confidenceScore", c.getConfidenceScore());
        m.put("confidenceRating", c.getConfidenceScore());
        m.put("confidenceLevel", c.getConfidenceLevel());
        m.put("confidenceTier", c.getConfidenceLevel());
        m.put("matchNotes", c.getMatchNotes());
        m.put("explanation", c.getMatchNotes());
        m.put("status", c.getStatus());
        m.put("createdAt", c.getCreatedAt());
        return m;
    }
}

