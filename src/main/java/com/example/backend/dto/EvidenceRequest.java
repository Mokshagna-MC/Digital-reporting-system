package com.example.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class EvidenceRequest {
    @NotBlank(message = "Evidence title/description is required.")
    @Size(max = 200)
    private String title;

    @NotBlank(message = "Evidence type is required (e.g. PHOTO, VIDEO, DOCUMENT, FORENSIC_REPORT).")
    @Size(max = 50)
    private String evidenceType;

    @NotBlank(message = "File reference/URL is required.")
    @Size(max = 500)
    private String fileReference;

    @Size(max = 2000)
    private String chainOfCustody;

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getEvidenceType() { return evidenceType; }
    public void setEvidenceType(String evidenceType) { this.evidenceType = evidenceType; }

    public String getFileReference() { return fileReference; }
    public void setFileReference(String fileReference) { this.fileReference = fileReference; }

    public String getChainOfCustody() { return chainOfCustody; }
    public void setChainOfCustody(String chainOfCustody) { this.chainOfCustody = chainOfCustody; }
}

