package com.example.backend.dto;

import jakarta.validation.constraints.Size;

public class UserCredentialsDto {
    @Size(max = 100)
    private String badgeNumber;

    @Size(max = 150)
    private String departmentOrOrg;

    @Size(max = 100)
    private String designation;

    @Size(max = 50)
    private String contactNumber;

    @Size(max = 1000)
    private String credentialsNotes;

    public String getBadgeNumber() { return badgeNumber; }
    public void setBadgeNumber(String badgeNumber) { this.badgeNumber = badgeNumber; }

    public String getDepartmentOrOrg() { return departmentOrOrg; }
    public void setDepartmentOrOrg(String departmentOrOrg) { this.departmentOrOrg = departmentOrOrg; }

    public String getDesignation() { return designation; }
    public void setDesignation(String designation) { this.designation = designation; }

    public String getContactNumber() { return contactNumber; }
    public void setContactNumber(String contactNumber) { this.contactNumber = contactNumber; }

    public String getCredentialsNotes() { return credentialsNotes; }
    public void setCredentialsNotes(String credentialsNotes) { this.credentialsNotes = credentialsNotes; }
}

