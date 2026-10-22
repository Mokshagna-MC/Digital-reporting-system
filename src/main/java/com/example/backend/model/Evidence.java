package com.example.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "evidence_items", indexes = {
    @Index(name = "idx_evidence_report_id", columnList = "report_id"),
    @Index(name = "idx_evidence_hash", columnList = "file_hash")
})
public class Evidence {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "report_id", nullable = false)
    private Report report;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(name = "evidence_type", nullable = false, length = 50)
    private String evidenceType; // PHOTO, VIDEO, DOCUMENT, AUDIO, FORENSIC_REPORT, PHYSICAL_ITEM

    @Column(name = "file_reference", nullable = false, length = 500)
    private String fileReference;

    @Column(name = "file_hash", length = 64)
    private String fileHash; // SHA-256 hash for tamper-evident chain of custody

    @Column(nullable = false, length = 120)
    private String uploader;

    @Column(name = "uploader_role", nullable = false, length = 50)
    private String uploaderRole;

    @Column(name = "chain_of_custody", length = 2000)
    private String chainOfCustody;

    @Column(name = "uploaded_at", nullable = false)
    private LocalDateTime uploadedAt = LocalDateTime.now();

    public Evidence() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Report getReport() { return report; }
    public void setReport(Report report) { this.report = report; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getEvidenceType() { return evidenceType; }
    public void setEvidenceType(String evidenceType) { this.evidenceType = evidenceType; }

    public String getFileReference() { return fileReference; }
    public void setFileReference(String fileReference) { this.fileReference = fileReference; }

    public String getFileHash() { return fileHash; }
    public void setFileHash(String fileHash) { this.fileHash = fileHash; }

    public String getUploader() { return uploader; }
    public void setUploader(String uploader) { this.uploader = uploader; }

    public String getUploaderRole() { return uploaderRole; }
    public void setUploaderRole(String uploaderRole) { this.uploaderRole = uploaderRole; }

    public String getChainOfCustody() { return chainOfCustody; }
    public void setChainOfCustody(String chainOfCustody) { this.chainOfCustody = chainOfCustody; }

    public LocalDateTime getUploadedAt() { return uploadedAt; }
    public void setUploadedAt(LocalDateTime uploadedAt) { this.uploadedAt = uploadedAt; }
}

