package com.example.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "report_endorsements", uniqueConstraints = {
    @UniqueConstraint(name = "uk_report_user_endorsement", columnNames = {"report_id", "user_id"})
}, indexes = {
    @Index(name = "idx_endorsements_report_id", columnList = "report_id")
})
public class ReportEndorsement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "report_id", nullable = false)
    private Report report;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "endorser_username", nullable = false, length = 120)
    private String endorserUsername;

    @Column(name = "endorser_role", nullable = false, length = 50)
    private String endorserRole;

    @Column(nullable = false, length = 30)
    private String verdict = "AUTHENTIC"; // AUTHENTIC, PLAUSIBLE, DISPUTED

    @Column(length = 1000)
    private String endorsementNote;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public ReportEndorsement() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Report getReport() { return report; }
    public void setReport(Report report) { this.report = report; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getEndorserUsername() { return endorserUsername; }
    public void setEndorserUsername(String endorserUsername) { this.endorserUsername = endorserUsername; }

    public String getEndorserRole() { return endorserRole; }
    public void setEndorserRole(String endorserRole) { this.endorserRole = endorserRole; }

    public String getVerdict() { return verdict; }
    public void setVerdict(String verdict) { this.verdict = verdict; }

    public String getEndorsementNote() { return endorsementNote; }
    public void setEndorsementNote(String endorsementNote) { this.endorsementNote = endorsementNote; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

