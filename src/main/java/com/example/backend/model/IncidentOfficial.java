package com.example.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "incident_officials", indexes = {
    @Index(name = "idx_officials_report_id", columnList = "report_id"),
    @Index(name = "idx_officials_badge", columnList = "badgeNumber"),
    @Index(name = "idx_officials_first_taker", columnList = "firstReportTaker")
})
public class IncidentOfficial {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "report_id", nullable = false)
    private Report report;

    @Column(name = "official_name", nullable = false, length = 150)
    private String officialName;

    @Column(name = "badge_number", nullable = false, length = 100)
    private String badgeNumber;

    @Column(nullable = false, length = 150)
    private String department;

    @Column(nullable = false, length = 100)
    private String designation;

    @Column(name = "contact_info", length = 150)
    private String contactInfo;

    @Column(name = "first_report_taker", nullable = false)
    private boolean firstReportTaker = false;

    @Column(name = "arrival_time")
    private LocalDateTime arrivalTime;

    @Column(name = "duties_summary", length = 1000)
    private String dutiesSummary;

    @Column(name = "recorded_at", nullable = false)
    private LocalDateTime recordedAt = LocalDateTime.now();

    @Column(name = "recorded_by", length = 120)
    private String recordedBy;

    public IncidentOfficial() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Report getReport() { return report; }
    public void setReport(Report report) { this.report = report; }

    public String getOfficialName() { return officialName; }
    public void setOfficialName(String officialName) { this.officialName = officialName; }

    public String getBadgeNumber() { return badgeNumber; }
    public void setBadgeNumber(String badgeNumber) { this.badgeNumber = badgeNumber; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getDesignation() { return designation; }
    public void setDesignation(String designation) { this.designation = designation; }

    public String getContactInfo() { return contactInfo; }
    public void setContactInfo(String contactInfo) { this.contactInfo = contactInfo; }

    public boolean isFirstReportTaker() { return firstReportTaker; }
    public void setFirstReportTaker(boolean firstReportTaker) { this.firstReportTaker = firstReportTaker; }

    public LocalDateTime getArrivalTime() { return arrivalTime; }
    public void setArrivalTime(LocalDateTime arrivalTime) { this.arrivalTime = arrivalTime; }

    public String getDutiesSummary() { return dutiesSummary; }
    public void setDutiesSummary(String dutiesSummary) { this.dutiesSummary = dutiesSummary; }

    public LocalDateTime getRecordedAt() { return recordedAt; }
    public void setRecordedAt(LocalDateTime recordedAt) { this.recordedAt = recordedAt; }

    public String getRecordedBy() { return recordedBy; }
    public void setRecordedBy(String recordedBy) { this.recordedBy = recordedBy; }
}

