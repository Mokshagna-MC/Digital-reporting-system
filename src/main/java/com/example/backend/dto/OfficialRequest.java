package com.example.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

public class OfficialRequest {
    @NotBlank
    @Size(max = 150)
    private String officialName;

    @NotBlank
    @Size(max = 100)
    private String badgeNumber;

    @NotBlank
    @Size(max = 150)
    private String department;

    @NotBlank
    @Size(max = 100)
    private String designation;

    @Size(max = 150)
    private String contactInfo;

    private boolean firstReportTaker = false;

    private LocalDateTime arrivalTime;

    @Size(max = 1000)
    private String dutiesSummary;

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
}

