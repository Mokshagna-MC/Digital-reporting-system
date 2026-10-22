package com.example.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ContributionRequest {
    @NotBlank
    @Size(max = 4000)
    private String infoText;

    @Size(max = 500)
    private String contributorLoc;

    private Double latitude;
    private Double longitude;

    public String getInfoText() { return infoText; }
    public void setInfoText(String infoText) { this.infoText = infoText; }

    public String getContributorLoc() { return contributorLoc; }
    public void setContributorLoc(String contributorLoc) { this.contributorLoc = contributorLoc; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
}

