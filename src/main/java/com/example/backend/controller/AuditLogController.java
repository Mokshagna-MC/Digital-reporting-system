package com.example.backend.controller;

import com.example.backend.model.AuditLog;
import com.example.backend.model.Report;
import com.example.backend.model.User;
import com.example.backend.repository.ReportRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.AuditLogService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/api")
public class AuditLogController {
    private final AuditLogService auditLogService;
    private final ReportRepository reports;
    private final UserRepository users;

    public AuditLogController(AuditLogService auditLogService, ReportRepository reports, UserRepository users) {
        this.auditLogService = auditLogService;
        this.reports = reports;
        this.users = users;
    }

    @GetMapping("/audit-logs")
    public ResponseEntity<?> getAllAuditLogs(HttpSession session) {
        User user = currentUser(session);
        if (user == null) return unauthorized();
        if (!isStaff(user)) {
            return ResponseEntity.status(403).body(Map.of("message", "Police/Admin access required for audit logs."));
        }
        return ResponseEntity.ok(auditLogService.getRecentLogs());
    }

    @GetMapping("/reports/{id}/audit-logs")
    public ResponseEntity<?> getReportAuditLogs(@PathVariable Long id, HttpSession session) {
        User user = currentUser(session);
        Report report = reports.findById(id).orElse(null);
        if (report == null) return ResponseEntity.notFound().build();

        boolean isStaffUser = user != null && isStaff(user);
        boolean isOwner = (user != null && report.getReporter() != null && report.getReporter().getId().equals(user.getId()))
                || Objects.equals(session.getAttribute("accessibleReportId"), id);

        if (!isStaffUser && !isOwner) {
            return ResponseEntity.status(403).body(Map.of("message", "Access restricted to authorized personnel or the verified case owner."));
        }
        return ResponseEntity.ok(auditLogService.getLogsForReport(id));
    }

    private User currentUser(HttpSession session) {
        Object id = session.getAttribute("userId");
        if (!(id instanceof Long userId)) return null;
        return users.findById(userId).orElse(null);
    }

    private boolean isStaff(User user) {
        return "POLICE".equals(user.getRole()) || "ADMIN".equals(user.getRole()) || "GOVERNMENT_OFFICIAL".equals(user.getRole());
    }

    private ResponseEntity<?> unauthorized() {
        return ResponseEntity.status(401).body(Map.of("message", "Please log in."));
    }
}

