package com.example.backend.service;

import com.example.backend.model.AuditLog;
import com.example.backend.repository.AuditLogRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AuditLogService {
    private final AuditLogRepository auditLogs;

    public AuditLogService(AuditLogRepository auditLogs) {
        this.auditLogs = auditLogs;
    }

    @Transactional
    public AuditLog log(Long reportId, String action, String performedBy, String userRole,
                         String details, String previousValue, String newValue) {
        AuditLog log = new AuditLog(reportId, action, performedBy, userRole, details, previousValue, newValue);
        return auditLogs.save(log);
    }

    public List<AuditLog> getLogsForReport(Long reportId) {
        return auditLogs.findByReportIdOrderByTimestampDesc(reportId);
    }

    public List<AuditLog> getRecentLogs() {
        return auditLogs.findTop100ByOrderByTimestampDesc();
    }

    public long count() {
        return auditLogs.count();
    }
}

