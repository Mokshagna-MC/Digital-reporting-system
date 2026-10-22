package com.example.backend.controller;

import com.example.backend.dto.WitnessRequest;
import com.example.backend.model.Report;
import com.example.backend.model.User;
import com.example.backend.model.Witness;
import com.example.backend.repository.ReportRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.repository.WitnessRepository;
import com.example.backend.service.AuditLogService;
import com.example.backend.service.WitnessVerificationService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class WitnessController {

    private final WitnessRepository witnessRepository;
    private final ReportRepository reports;
    private final UserRepository users;
    private final WitnessVerificationService verificationService;
    private final AuditLogService auditLogService;

    public WitnessController(WitnessRepository witnessRepository,
                             ReportRepository reports,
                             UserRepository users,
                             WitnessVerificationService verificationService,
                             AuditLogService auditLogService) {
        this.witnessRepository = witnessRepository;
        this.reports = reports;
        this.users = users;
        this.verificationService = verificationService;
        this.auditLogService = auditLogService;
    }

    @PostMapping("/reports/{id}/witnesses")
    public ResponseEntity<?> addWitness(@PathVariable Long id,
                                        @Valid @RequestBody WitnessRequest request,
                                        HttpSession session) {
        User recorder = currentUser(session);
        if (recorder == null) return unauthorized();

        Report report = reports.findById(id).orElse(null);
        if (report == null) return ResponseEntity.notFound().build();

        // Retrieve existing prior witnesses to cross-examine consistency
        List<Witness> priorWitnesses = witnessRepository.findByReportIdOrderByCreatedAtDesc(id);

        Witness witness = new Witness();
        witness.setReport(report);
        witness.setWitnessName(request.getWitnessName().trim());
        witness.setContactDetails(request.getContactDetails() != null ? request.getContactDetails().trim() : null);
        witness.setStatement(request.getStatement().trim());
        witness.setWitnessType(request.getWitnessType() != null ? request.getWitnessType().trim() : "LATER_WITNESS");
        witness.setLocationObserved(request.getLocationObserved() != null ? request.getLocationObserved().trim() : null);
        witness.setTimeObserved(request.getTimeObserved());
        
        // Distinct roles: Who witnessed vs Who recorded into the system
        witness.setRecordedBy(recorder.getUsername());
        witness.setRecordedByRole(recorder.getRole());
        witness.setCreatedAt(LocalDateTime.now());

        // Perform automated consistency verification
        WitnessVerificationService.VerificationOutcome outcome = verificationService.verifyWitnessStatement(
                report, priorWitnesses, witness
        );

        witness.setVerificationStatus(outcome.getStatus());
        witness.setVerificationScore(outcome.getScore());
        witness.setVerificationNotes(outcome.getNotes());

        Witness saved = witnessRepository.save(witness);

        // Record Audit Log entry
        String auditDetail = String.format("Witness statement recorded for '%s' by %s (%s). Verification outcome: %s (%d%% consistency).",
                saved.getWitnessName(), recorder.getUsername(), recorder.getRole(), outcome.getStatus(), outcome.getScore());

        auditLogService.log(id, "WITNESS_RECORDED", recorder.getUsername(), recorder.getRole(),
                auditDetail, null, outcome.getStatus());

        return ResponseEntity.ok(toMap(saved));
    }

    @GetMapping("/reports/{id}/witnesses")
    public ResponseEntity<?> getReportWitnesses(@PathVariable Long id, HttpSession session) {
        User user = currentUser(session);
        if (user == null) return unauthorized();

        Report report = reports.findById(id).orElse(null);
        if (report == null) return ResponseEntity.notFound().build();

        List<Witness> list = witnessRepository.findByReportIdOrderByCreatedAtDesc(id);
        return ResponseEntity.ok(list.stream().map(this::toMap).collect(Collectors.toList()));
    }

    @PatchMapping("/witnesses/{id}/review")
    public ResponseEntity<?> reviewWitness(@PathVariable Long id,
                                           @RequestBody Map<String, String> body,
                                           HttpSession session) {
        User user = currentUser(session);
        if (user == null) return unauthorized();
        if (!isAuthorizedReviewer(user)) {
            return ResponseEntity.status(403).body(Map.of("message", "Authorized reviewer access required (Government Official, Police, or Admin)."));
        }

        Witness witness = witnessRepository.findById(id).orElse(null);
        if (witness == null) return ResponseEntity.notFound().build();

        String newStatus = body.getOrDefault("status", "").trim().toUpperCase(Locale.ROOT);
        if (!Set.of("CONSISTENT", "NEEDS_REVIEW", "INCONSISTENT", "OFFICIALLY_VERIFIED").contains(newStatus)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid verification status."));
        }

        String oldStatus = witness.getVerificationStatus();
        witness.setVerificationStatus(newStatus);
        if (body.containsKey("reviewNotes")) {
            witness.setVerificationNotes((witness.getVerificationNotes() != null ? witness.getVerificationNotes() + "\n" : "") +
                    "[Review by " + user.getUsername() + " (" + user.getRole() + ")]: " + body.get("reviewNotes").trim());
        }

        Witness saved = witnessRepository.save(witness);

        auditLogService.log(saved.getReport().getId(), "WITNESS_REVIEWED", user.getUsername(), user.getRole(),
                String.format("Witness #%d ('%s') reviewed by %s. Status changed from %s to %s.",
                        id, saved.getWitnessName(), user.getUsername(), oldStatus, newStatus),
                oldStatus, newStatus);

        return ResponseEntity.ok(toMap(saved));
    }

    private User currentUser(HttpSession session) {
        Object id = session.getAttribute("userId");
        if (!(id instanceof Long userId)) return null;
        return users.findById(userId).orElse(null);
    }

    private boolean isAuthorizedReviewer(User user) {
        String role = user.getRole();
        return "GOVERNMENT_OFFICIAL".equals(role) || "POLICE".equals(role) || "ADMIN".equals(role);
    }

    private ResponseEntity<?> unauthorized() {
        return ResponseEntity.status(401).body(Map.of("message", "Please log in."));
    }

    private Map<String, Object> toMap(Witness w) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", w.getId());
        m.put("reportId", w.getReport().getId());
        m.put("witnessName", w.getWitnessName());
        m.put("contactDetails", w.getContactDetails());
        m.put("statement", w.getStatement());
        m.put("witnessType", w.getWitnessType());
        m.put("locationObserved", w.getLocationObserved());
        m.put("timeObserved", w.getTimeObserved());
        m.put("recordedBy", w.getRecordedBy());
        m.put("recordedByRole", w.getRecordedByRole());
        m.put("verificationStatus", w.getVerificationStatus());
        m.put("verificationScore", w.getVerificationScore());
        m.put("verificationNotes", w.getVerificationNotes());
        m.put("createdAt", w.getCreatedAt());
        return m;
    }
}

