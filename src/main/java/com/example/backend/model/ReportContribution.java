package com.example.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "report_contributions", indexes = {
    @Index(name = "idx_contrib_report_id", columnList = "report_id"),
    @Index(name = "idx_contrib_confidence", columnList = "confidenceScore")
})
public class ReportContribution {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "report_id", nullable = false)
    private Report report;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contributor_id")
    private User contributor;

    @Column(name = "contributor_username", nullable = false, length = 120)
    private String contributorUsername;

    @Column(name = "info_text", nullable = false, length = 4000)
    private String infoText;

    @Column(name = "contributor_loc", length = 500)
    private String contributorLoc;

    @Column
    private Double latitude;

    @Column
    private Double longitude;

    @Column(name = "distance_km")
    private Double distanceKm;

    @Column(name = "confidence_score", nullable = false)
    private Integer confidenceScore;

    @Column(name = "confidence_level", nullable = false, length = 30)
    private String confidenceLevel;

    @Column(name = "match_notes", length = 1000)
    private String matchNotes;

    @Column(nullable = false, length = 30)
    private String status = "PENDING_REVIEW";

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public ReportContribution() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Report getReport() { return report; }
    public void setReport(Report report) { this.report = report; }

    public User getContributor() { return contributor; }
    public void setContributor(User contributor) { this.contributor = contributor; }

    public String getContributorUsername() { return contributorUsername; }
    public void setContributorUsername(String contributorUsername) { this.contributorUsername = contributorUsername; }

    public String getInfoText() { return infoText; }
    public void setInfoText(String infoText) { this.infoText = infoText; }

    public String getContributorLoc() { return contributorLoc; }
    public void setContributorLoc(String contributorLoc) { this.contributorLoc = contributorLoc; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public Double getDistanceKm() { return distanceKm; }
    public void setDistanceKm(Double distanceKm) { this.distanceKm = distanceKm; }

    public Integer getConfidenceScore() { return confidenceScore; }
    public void setConfidenceScore(Integer confidenceScore) { this.confidenceScore = confidenceScore; }

    public String getConfidenceLevel() { return confidenceLevel; }
    public void setConfidenceLevel(String confidenceLevel) { this.confidenceLevel = confidenceLevel; }

    public String getMatchNotes() { return matchNotes; }
    public void setMatchNotes(String matchNotes) { this.matchNotes = matchNotes; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

