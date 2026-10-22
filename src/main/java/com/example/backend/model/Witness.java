package com.example.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "witnesses", indexes = {
    @Index(name = "idx_witnesses_report_id", columnList = "report_id"),
    @Index(name = "idx_witnesses_verification", columnList = "verificationStatus")
})
public class Witness {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "report_id", nullable = false)
    private Report report;

    @Column(name = "witness_name", nullable = false, length = 150)
    private String witnessName;

    @Column(name = "contact_details", length = 180)
    private String contactDetails;

    @Column(nullable = false, length = 5000)
    private String statement;

    @Column(name = "witness_type", nullable = false, length = 30)
    private String witnessType = "LATER_WITNESS"; // INITIAL_SOURCE or LATER_WITNESS

    @Column(name = "location_observed", length = 500)
    private String locationObserved;

    @Column(name = "time_observed")
    private LocalDateTime timeObserved;

    @Column(name = "recorded_by", nullable = false, length = 120)
    private String recordedBy;

    @Column(name = "recorded_by_role", nullable = false, length = 50)
    private String recordedByRole;

    @Column(name = "verification_status", nullable = false, length = 30)
    private String verificationStatus = "NEEDS_REVIEW"; // CONSISTENT, NEEDS_REVIEW, INCONSISTENT, INITIAL_RECORD

    @Column(name = "verification_score")
    private Integer verificationScore;

    @Column(name = "verification_notes", length = 2000)
    private String verificationNotes;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Witness() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Report getReport() { return report; }
    public void setReport(Report report) { this.report = report; }

    public String getWitnessName() { return witnessName; }
    public void setWitnessName(String witnessName) { this.witnessName = witnessName; }

    public String getContactDetails() { return contactDetails; }
    public void setContactDetails(String contactDetails) { this.contactDetails = contactDetails; }

    public String getStatement() { return statement; }
    public void setStatement(String statement) { this.statement = statement; }

    public String getWitnessType() { return witnessType; }
    public void setWitnessType(String witnessType) { this.witnessType = witnessType; }

    public String getLocationObserved() { return locationObserved; }
    public void setLocationObserved(String locationObserved) { this.locationObserved = locationObserved; }

    public LocalDateTime getTimeObserved() { return timeObserved; }
    public void setTimeObserved(LocalDateTime timeObserved) { this.timeObserved = timeObserved; }

    public String getRecordedBy() { return recordedBy; }
    public void setRecordedBy(String recordedBy) { this.recordedBy = recordedBy; }

    public String getRecordedByRole() { return recordedByRole; }
    public void setRecordedByRole(String recordedByRole) { this.recordedByRole = recordedByRole; }

    public String getVerificationStatus() { return verificationStatus; }
    public void setVerificationStatus(String verificationStatus) { this.verificationStatus = verificationStatus; }

    public Integer getVerificationScore() { return verificationScore; }
    public void setVerificationScore(Integer verificationScore) { this.verificationScore = verificationScore; }

    public String getVerificationNotes() { return verificationNotes; }
    public void setVerificationNotes(String verificationNotes) { this.verificationNotes = verificationNotes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

