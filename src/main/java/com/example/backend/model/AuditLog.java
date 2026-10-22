package com.example.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs", indexes = {
    @Index(name = "idx_audit_report_id", columnList = "reportId"),
    @Index(name = "idx_audit_timestamp", columnList = "timestamp")
})
public class AuditLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "report_id")
    private Long reportId;

    @Column(nullable = false, length = 100)
    private String action;

    @Column(name = "performed_by", nullable = false, length = 120)
    private String performedBy;

    @Column(name = "user_role", nullable = false, length = 50)
    private String userRole;

    @Column(nullable = false, length = 2000)
    private String details;

    @Column(name = "previous_value", length = 500)
    private String previousValue;

    @Column(name = "new_value", length = 500)
    private String newValue;

    @Column(nullable = false)
    private LocalDateTime timestamp = LocalDateTime.now();

    public AuditLog() {}

    public AuditLog(Long reportId, String action, String performedBy, String userRole, String details, String previousValue, String newValue) {
        this.reportId = reportId;
        this.action = action;
        this.performedBy = performedBy;
        this.userRole = userRole;
        this.details = details;
        this.previousValue = previousValue;
        this.newValue = newValue;
        this.timestamp = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getReportId() { return reportId; }
    public void setReportId(Long reportId) { this.reportId = reportId; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public String getPerformedBy() { return performedBy; }
    public void setPerformedBy(String performedBy) { this.performedBy = performedBy; }

    public String getUserRole() { return userRole; }
    public void setUserRole(String userRole) { this.userRole = userRole; }

    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }

    public String getPreviousValue() { return previousValue; }
    public void setPreviousValue(String previousValue) { this.previousValue = previousValue; }

    public String getNewValue() { return newValue; }
    public void setNewValue(String newValue) { this.newValue = newValue; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}

