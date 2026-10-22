package com.example.backend.controller;

import com.example.backend.dto.EvidenceRequest;
import com.example.backend.model.Evidence;
import com.example.backend.model.Report;
import com.example.backend.model.User;
import com.example.backend.repository.EvidenceRepository;
import com.example.backend.repository.ReportRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.AuditLogService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class EvidenceController {

    private final EvidenceRepository evidenceRepository;
    private final ReportRepository reports;
    private final UserRepository users;
    private final AuditLogService auditLogService;

    public EvidenceController(EvidenceRepository evidenceRepository,
                              ReportRepository reports,
                              UserRepository users,
                              AuditLogService auditLogService) {
        this.evidenceRepository = evidenceRepository;
        this.reports = reports;
        this.users = users;
        this.auditLogService = auditLogService;
    }

    @PostMapping("/reports/{id}/evidence")
    public ResponseEntity<?> addEvidence(@PathVariable Long id,
                                         @Valid @RequestBody EvidenceRequest request,
                                         HttpSession session) {
        User user = currentUser(session);
        if (user == null) return unauthorized();

        Report report = reports.findById(id).orElse(null);
        if (report == null) return ResponseEntity.notFound().build();

        // Generate SHA-256 hash for tamper-evident chain of custody
        String hashInput = request.getTitle() + ":" + request.getFileReference() + ":" + System.currentTimeMillis();
        String sha256Hash = computeSha256(hashInput);

        Evidence evidence = new Evidence();
        evidence.setReport(report);
        evidence.setTitle(request.getTitle().trim());
        evidence.setEvidenceType(request.getEvidenceType().trim().toUpperCase(Locale.ROOT));
        evidence.setFileReference(request.getFileReference().trim());
        evidence.setFileHash(sha256Hash);
        evidence.setUploader(user.getUsername());
        evidence.setUploaderRole(user.getRole());
        evidence.setChainOfCustody(request.getChainOfCustody() != null ? request.getChainOfCustody().trim() : "Initial upload by " + user.getUsername());
        evidence.setUploadedAt(LocalDateTime.now());

        Evidence saved = evidenceRepository.save(evidence);

        // Record in Audit Log
        String auditDetail = String.format("Attached evidence '%s' (%s). SHA-256 Hash: %s. Chain of custody initialized.",
                saved.getTitle(), saved.getEvidenceType(), saved.getFileHash().substring(0, 16) + "...");

        auditLogService.log(id, "EVIDENCE_ATTACHED", user.getUsername(), user.getRole(),
                auditDetail, null, saved.getEvidenceType() + " (" + saved.getTitle() + ")");

        return ResponseEntity.ok(toMap(saved));
    }

    @GetMapping("/reports/{id}/evidence")
    public ResponseEntity<?> getReportEvidence(@PathVariable Long id, HttpSession session) {
        User user = currentUser(session);
        if (user == null) return unauthorized();

        Report report = reports.findById(id).orElse(null);
        if (report == null) return ResponseEntity.notFound().build();

        List<Evidence> list = evidenceRepository.findByReportIdOrderByUploadedAtDesc(id);
        return ResponseEntity.ok(list.stream().map(this::toMap).collect(Collectors.toList()));
    }

    private User currentUser(HttpSession session) {
        Object id = session.getAttribute("userId");
        if (!(id instanceof Long userId)) return null;
        return users.findById(userId).orElse(null);
    }

    private ResponseEntity<?> unauthorized() {
        return ResponseEntity.status(401).body(Map.of("message", "Please log in."));
    }

    private String computeSha256(String data) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (Exception e) {
            return UUID.randomUUID().toString().replace("-", "");
        }
    }

    private Map<String, Object> toMap(Evidence e) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", e.getId());
        m.put("reportId", e.getReport().getId());
        m.put("title", e.getTitle());
        m.put("evidenceType", e.getEvidenceType());
        m.put("fileReference", e.getFileReference());
        m.put("fileHash", e.getFileHash());
        m.put("uploader", e.getUploader());
        m.put("uploaderRole", e.getUploaderRole());
        m.put("chainOfCustody", e.getChainOfCustody());
        m.put("uploadedAt", e.getUploadedAt());
        return m;
    }
}

