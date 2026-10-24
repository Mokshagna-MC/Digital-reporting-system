package com.example.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reports", indexes = {
    @Index(name = "idx_reports_ref_code", columnList = "reference_code")
})
public class Report {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "reference_code", length = 50)
    private String referenceCode;

    @Column(nullable = false, length = 80)
    private String eventType;

    @Column(name = "incident_overview", length = 1000)
    private String incidentOverview;

    @Column(nullable = false, length = 5000)
    private String description;

    @Column(nullable = false, length = 500)
    private String loc;

    @Column(nullable = false)
    private LocalDateTime dateTime;

    @Column(nullable = false, length = 30)
    private String status = "PENDING";

    @Column(length = 100)
    private String firNumber;

    @Column
    private Double latitude;

    @Column
    private Double longitude;

    @Column(name = "photo_url", columnDefinition = "TEXT")
    private String photoUrl;

    @Column(name = "keyphrase_hash", length = 120)
    private String keyphraseHash;

    @Column(name = "keyphrase_hint", length = 100)
    private String keyphraseHint;

    @Column(name = "is_anonymous", nullable = false)
    private boolean anonymous = true;

    @Column(name = "anonymous_session_token", length = 100)
    private String anonymousSessionToken;

    @Column(name = "parent_reference_code", length = 50)
    private String parentReferenceCode;

    @Column(name = "is_duplicate_merged")
    private Boolean duplicateMerged = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reporter_id", nullable = true)
    private User reporter;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    public Report() {}

    @PrePersist
    public void beforeInsert() {
        if (referenceCode == null || referenceCode.isBlank()) {
            referenceCode = String.format("RPT-%d-%05d", LocalDateTime.now().getYear(), (int)(Math.random() * 90000 + 10000));
        }
    }

    @PreUpdate
    public void beforeUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Long getId(){ return id; }
    public void setId(Long id){ this.id = id; }
    public String getReferenceCode(){ return referenceCode; }
    public void setReferenceCode(String referenceCode){ this.referenceCode = referenceCode; }
    public String getEventType(){ return eventType; }
    public void setEventType(String eventType){ this.eventType = eventType; }
    public String getIncidentOverview(){ return incidentOverview; }
    public void setIncidentOverview(String incidentOverview){ this.incidentOverview = incidentOverview; }
    public String getDescription(){ return description; }
    public void setDescription(String description){ this.description = description; }
    public String getLoc(){ return loc; }
    public void setLoc(String loc){ this.loc = loc; }
    public LocalDateTime getDateTime(){ return dateTime; }
    public void setDateTime(LocalDateTime dateTime){ this.dateTime = dateTime; }
    public String getStatus(){ return status; }
    public void setStatus(String status){ this.status = status; }
    public String getFirNumber(){ return firNumber; }
    public void setFirNumber(String firNumber){ this.firNumber = firNumber; }
    public Double getLatitude(){ return latitude; }
    public void setLatitude(Double latitude){ this.latitude = latitude; }
    public Double getLongitude(){ return longitude; }
    public void setLongitude(Double longitude){ this.longitude = longitude; }
    public User getReporter(){ return reporter; }
    public void setReporter(User reporter){ this.reporter = reporter; }
    public LocalDateTime getCreatedAt(){ return createdAt; }
    public LocalDateTime getUpdatedAt(){ return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt){ this.updatedAt = updatedAt; }
    public String getPhotoUrl(){ return photoUrl; }
    public void setPhotoUrl(String photoUrl){ this.photoUrl = photoUrl; }
    public String getKeyphraseHash() { return keyphraseHash; }
    public void setKeyphraseHash(String keyphraseHash) { this.keyphraseHash = keyphraseHash; }
    public String getKeyphraseHint() { return keyphraseHint; }
    public void setKeyphraseHint(String keyphraseHint) { this.keyphraseHint = keyphraseHint; }
    public boolean isAnonymous() { return anonymous; }
    public void setAnonymous(boolean anonymous) { this.anonymous = anonymous; }
    public String getAnonymousSessionToken() { return anonymousSessionToken; }
    public void setAnonymousSessionToken(String anonymousSessionToken) { this.anonymousSessionToken = anonymousSessionToken; }
    public String getParentReferenceCode() { return parentReferenceCode; }
    public void setParentReferenceCode(String parentReferenceCode) { this.parentReferenceCode = parentReferenceCode; }
    public Boolean getDuplicateMerged() { return duplicateMerged != null && duplicateMerged; }
    public void setDuplicateMerged(Boolean duplicateMerged) { this.duplicateMerged = duplicateMerged; }
}
