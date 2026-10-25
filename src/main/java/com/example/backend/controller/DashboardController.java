package com.example.backend.controller;

import com.example.backend.model.AuditLog;
import com.example.backend.model.Report;
import com.example.backend.model.User;
import com.example.backend.repository.AuditLogRepository;
import com.example.backend.repository.IncidentOfficialRepository;
import com.example.backend.repository.ReportContributionRepository;
import com.example.backend.repository.ReportRepository;
import com.example.backend.repository.UserRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {
    private final ReportRepository reports;
    private final UserRepository users;
    private final AuditLogRepository auditLogs;
    private final IncidentOfficialRepository officialRepository;
    private final ReportContributionRepository contributionRepository;

    public DashboardController(ReportRepository reports,
                               UserRepository users,
                               AuditLogRepository auditLogs,
                               IncidentOfficialRepository officialRepository,
                               ReportContributionRepository contributionRepository) {
        this.reports = reports;
        this.users = users;
        this.auditLogs = auditLogs;
        this.officialRepository = officialRepository;
        this.contributionRepository = contributionRepository;
    }

    @GetMapping
    @Cacheable(value = "dashboardMetrics", key = "'publicDashboard'", condition = "#session.getAttribute('userId') == null")
    public ResponseEntity<?> dashboard(HttpSession session) {
        Object id = session.getAttribute("userId");
        User user = (id instanceof Long userId) ? users.findById(userId).orElse(null) : null;

        boolean isStaff = user != null && ("POLICE".equals(user.getRole()) || "ADMIN".equals(user.getRole()));
        
        List<Report> all = reports.findAllByOrderByCreatedAtDesc();

        long pending = all.stream().filter(r -> "PENDING".equalsIgnoreCase(r.getStatus())).count();
        long underReview = all.stream().filter(r -> "UNDER_REVIEW".equalsIgnoreCase(r.getStatus())).count();
        long investigating = all.stream().filter(r -> "INVESTIGATING".equalsIgnoreCase(r.getStatus())).count();
        long resolved = all.stream().filter(r -> "RESOLVED".equalsIgnoreCase(r.getStatus())).count();
        long closed = all.stream().filter(r -> "CLOSED".equalsIgnoreCase(r.getStatus())).count();

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("total", all.size());
        response.put("totalReports", all.size());
        response.put("pending", pending);
        response.put("underReview", underReview);
        response.put("investigating", investigating);
        response.put("resolved", resolved);
        response.put("closed", closed);

        // Extended stats for staff/admin window
        if (isStaff) {
            response.put("totalOfficials", officialRepository.count());
            response.put("totalContributions", contributionRepository.count());
            response.put("totalAuditLogs", auditLogs.count());
            List<AuditLog> recentLogs = auditLogs.findTop100ByOrderByTimestampDesc().stream().limit(20).toList();
            response.put("recentUpdates", recentLogs);
        } else {
            response.put("totalOfficials", officialRepository.count());
            response.put("totalContributions", contributionRepository.count());
            response.put("totalAuditLogs", auditLogs.count());
            response.put("recentUpdates", Collections.emptyList());
        }

        response.put("recent", all.stream().limit(5).map(r -> Map.of(
                "id", r.getId(),
                "eventType", r.getEventType(),
                "status", r.getStatus(),
                "createdAt", r.getCreatedAt()
        )).toList());

        return ResponseEntity.ok(response);
    }
}
