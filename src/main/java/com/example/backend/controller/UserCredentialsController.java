package com.example.backend.controller;

import com.example.backend.dto.UserCredentialsDto;
import com.example.backend.model.User;
import com.example.backend.repository.ReportEndorsementRepository;
import com.example.backend.repository.ReportRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.repository.WitnessRepository;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserCredentialsController {
    private final UserRepository userRepository;
    private final ReportRepository reportRepository;
    private final WitnessRepository witnessRepository;
    private final ReportEndorsementRepository endorsementRepository;

    public UserCredentialsController(UserRepository userRepository,
                                     ReportRepository reportRepository,
                                     WitnessRepository witnessRepository,
                                     ReportEndorsementRepository endorsementRepository) {
        this.userRepository = userRepository;
        this.reportRepository = reportRepository;
        this.witnessRepository = witnessRepository;
        this.endorsementRepository = endorsementRepository;
    }

    @GetMapping("/credentials")
    public ResponseEntity<?> getCredentials(HttpSession session) {
        User user = currentUser(session);
        if (user == null) return ResponseEntity.status(401).body(Map.of("message", "Please log in to view credentials."));

        long totalReports = reportRepository.findByReporterIdOrderByCreatedAtDesc(user.getId()).size();
        long totalWitnessStatements = witnessRepository.findAll().stream()
                .filter(w -> user.getUsername().equalsIgnoreCase(w.getRecordedBy()))
                .count();
        long totalEndorsementsGiven = endorsementRepository.countByUserId(user.getId());

        Map<String, Object> res = new LinkedHashMap<>();
        res.put("id", user.getId());
        res.put("username", user.getUsername());
        res.put("email", user.getEmail());
        res.put("role", user.getRole());
        res.put("createdAt", user.getCreatedAt());
        res.put("badgeNumber", user.getBadgeNumber() != null ? user.getBadgeNumber() : "");
        res.put("departmentOrOrg", user.getDepartmentOrOrg() != null ? user.getDepartmentOrOrg() : "");
        res.put("designation", user.getDesignation() != null ? user.getDesignation() : "");
        res.put("contactNumber", user.getContactNumber() != null ? user.getContactNumber() : "");
        res.put("verificationStatus", user.getVerificationStatus() != null ? user.getVerificationStatus() : "VERIFIED_ACTIVE");
        res.put("credentialsNotes", user.getCredentialsNotes() != null ? user.getCredentialsNotes() : "");
        res.put("emailVerified", user.getEmailVerified());
        res.put("lastLoginAt", user.getLastLoginAt());

        // User statistics
        res.put("totalReports", totalReports);
        res.put("totalWitnessStatements", totalWitnessStatements);
        res.put("totalEndorsementsGiven", totalEndorsementsGiven);

        return ResponseEntity.ok(res);
    }

    @PutMapping("/credentials")
    public ResponseEntity<?> updateCredentials(@Valid @RequestBody UserCredentialsDto dto, HttpSession session) {
        User user = currentUser(session);
        if (user == null) return ResponseEntity.status(401).body(Map.of("message", "Please log in to update credentials."));

        if (dto.getBadgeNumber() != null) user.setBadgeNumber(dto.getBadgeNumber().trim());
        if (dto.getDepartmentOrOrg() != null) user.setDepartmentOrOrg(dto.getDepartmentOrOrg().trim());
        if (dto.getDesignation() != null) user.setDesignation(dto.getDesignation().trim());
        if (dto.getContactNumber() != null) user.setContactNumber(dto.getContactNumber().trim());
        if (dto.getCredentialsNotes() != null) user.setCredentialsNotes(dto.getCredentialsNotes().trim());

        userRepository.save(user);

        long totalReports = reportRepository.findByReporterIdOrderByCreatedAtDesc(user.getId()).size();
        long totalWitnessStatements = witnessRepository.findAll().stream()
                .filter(w -> user.getUsername().equalsIgnoreCase(w.getRecordedBy()))
                .count();
        long totalEndorsementsGiven = endorsementRepository.countByUserId(user.getId());

        Map<String, Object> res = new LinkedHashMap<>();
        res.put("message", "Personal credentials updated successfully.");
        res.put("id", user.getId());
        res.put("username", user.getUsername());
        res.put("email", user.getEmail());
        res.put("role", user.getRole());
        res.put("badgeNumber", user.getBadgeNumber() != null ? user.getBadgeNumber() : "");
        res.put("departmentOrOrg", user.getDepartmentOrOrg() != null ? user.getDepartmentOrOrg() : "");
        res.put("designation", user.getDesignation() != null ? user.getDesignation() : "");
        res.put("contactNumber", user.getContactNumber() != null ? user.getContactNumber() : "");
        res.put("verificationStatus", user.getVerificationStatus() != null ? user.getVerificationStatus() : "VERIFIED_ACTIVE");
        res.put("credentialsNotes", user.getCredentialsNotes() != null ? user.getCredentialsNotes() : "");
        res.put("emailVerified", user.getEmailVerified());
        res.put("lastLoginAt", user.getLastLoginAt());
        res.put("totalReports", totalReports);
        res.put("totalWitnessStatements", totalWitnessStatements);
        res.put("totalEndorsementsGiven", totalEndorsementsGiven);

        return ResponseEntity.ok(res);
    }

    private User currentUser(HttpSession session) {
        Object id = session.getAttribute("userId");
        if (!(id instanceof Long userId)) return null;
        return userRepository.findById(userId).orElse(null);
    }
}
