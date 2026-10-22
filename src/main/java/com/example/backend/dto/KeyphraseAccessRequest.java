package com.example.backend.dto;

import jakarta.validation.constraints.NotBlank;

public class KeyphraseAccessRequest {
    @NotBlank(message = "Report reference code is required.")
    private String referenceCode;

    @NotBlank(message = "Secret keyphrase is required.")
    private String keyphrase;

    public KeyphraseAccessRequest() {}

    public KeyphraseAccessRequest(String referenceCode, String keyphrase) {
        this.referenceCode = referenceCode;
        this.keyphrase = keyphrase;
    }

    public String getReferenceCode() { return referenceCode; }
    public void setReferenceCode(String referenceCode) { this.referenceCode = referenceCode; }

    public String getKeyphrase() { return keyphrase; }
    public void setKeyphrase(String keyphrase) { this.keyphrase = keyphrase; }
}
