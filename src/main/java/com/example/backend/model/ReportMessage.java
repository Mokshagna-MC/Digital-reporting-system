package com.example.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "report_messages", indexes = {
    @Index(name = "idx_rep_msg_report_id", columnList = "report_id"),
    @Index(name = "idx_rep_msg_created_at", columnList = "created_at")
})
public class ReportMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "report_id", nullable = false)
    private Report report;

    @Column(name = "sender_type", nullable = false, length = 30)
    private String senderType; // "REPORTER" or "AUTHORITY"

    @Column(name = "sender_name", nullable = false, length = 120)
    private String senderName; // "Anonymous Reporter" or e.g. "Officer Jenkins (POLICE)"

    @Column(name = "sender_role", nullable = false, length = 50)
    private String senderRole; // "REPORTER", "POLICE", "ADMIN", "GOVERNMENT_OFFICIAL"

    @Column(name = "message_text", nullable = false, length = 4000)
    private String messageText;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "read_by_reporter", nullable = false)
    private boolean readByReporter = false;

    @Column(name = "read_by_authority", nullable = false)
    private boolean readByAuthority = false;

    public ReportMessage() {}

    public ReportMessage(Report report, String senderType, String senderName, String senderRole, String messageText) {
        this.report = report;
        this.senderType = senderType;
        this.senderName = senderName;
        this.senderRole = senderRole;
        this.messageText = messageText;
        this.createdAt = LocalDateTime.now();
        if ("REPORTER".equalsIgnoreCase(senderType)) {
            this.readByReporter = true;
            this.readByAuthority = false;
        } else {
            this.readByAuthority = true;
            this.readByReporter = false;
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Report getReport() { return report; }
    public void setReport(Report report) { this.report = report; }

    public String getSenderType() { return senderType; }
    public void setSenderType(String senderType) { this.senderType = senderType; }

    public String getSenderName() { return senderName; }
    public void setSenderName(String senderName) { this.senderName = senderName; }

    public String getSenderRole() { return senderRole; }
    public void setSenderRole(String senderRole) { this.senderRole = senderRole; }

    public String getMessageText() { return messageText; }
    public void setMessageText(String messageText) { this.messageText = messageText; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public boolean isReadByReporter() { return readByReporter; }
    public void setReadByReporter(boolean readByReporter) { this.readByReporter = readByReporter; }

    public boolean isReadByAuthority() { return readByAuthority; }
    public void setReadByAuthority(boolean readByAuthority) { this.readByAuthority = readByAuthority; }
}
