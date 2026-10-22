package com.example.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "app_users")
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 120)
    private String username;

    @Column(nullable = false, unique = true, length = 180)
    private String email;

    @Column(nullable = false)
    private String passwordHash;

    @Column(nullable = false, length = 50)
    private String role = "CITIZEN";

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(length = 100)
    private String badgeNumber;

    @Column(length = 150)
    private String departmentOrOrg;

    @Column(length = 100)
    private String designation;

    @Column(length = 50)
    private String contactNumber;

    @Column(length = 50)
    private String verificationStatus = "VERIFIED_ACTIVE";

    @Column(length = 1000)
    private String credentialsNotes;

    @Column(nullable = false)
    private Boolean emailVerified = false;

    @Column(length = 10)
    private String emailVerificationCode;

    @Column
    private LocalDateTime lastLoginAt;

    public User() {}
    public Long getId(){ return id; }
    public void setId(Long id){ this.id = id; }
    public String getUsername(){ return username; }
    public void setUsername(String username){ this.username = username; }
    public String getEmail(){ return email; }
    public void setEmail(String email){ this.email = email; }
    public String getPasswordHash(){ return passwordHash; }
    public void setPasswordHash(String passwordHash){ this.passwordHash = passwordHash; }
    public String getRole(){ return role; }
    public void setRole(String role){ this.role = role; }
    public LocalDateTime getCreatedAt(){ return createdAt; }

    public String getBadgeNumber() { return badgeNumber; }
    public void setBadgeNumber(String badgeNumber) { this.badgeNumber = badgeNumber; }

    public String getDepartmentOrOrg() { return departmentOrOrg; }
    public void setDepartmentOrOrg(String departmentOrOrg) { this.departmentOrOrg = departmentOrOrg; }

    public String getDesignation() { return designation; }
    public void setDesignation(String designation) { this.designation = designation; }

    public String getContactNumber() { return contactNumber; }
    public void setContactNumber(String contactNumber) { this.contactNumber = contactNumber; }

    public String getVerificationStatus() { return verificationStatus; }
    public void setVerificationStatus(String verificationStatus) { this.verificationStatus = verificationStatus; }

    public String getCredentialsNotes() { return credentialsNotes; }
    public void setCredentialsNotes(String credentialsNotes) { this.credentialsNotes = credentialsNotes; }

    public Boolean getEmailVerified() { return emailVerified != null && emailVerified; }
    public void setEmailVerified(Boolean emailVerified) { this.emailVerified = emailVerified; }

    public String getEmailVerificationCode() { return emailVerificationCode; }
    public void setEmailVerificationCode(String emailVerificationCode) { this.emailVerificationCode = emailVerificationCode; }

    public LocalDateTime getLastLoginAt() { return lastLoginAt; }
    public void setLastLoginAt(LocalDateTime lastLoginAt) { this.lastLoginAt = lastLoginAt; }
}
