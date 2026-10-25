package com.example.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

public class ReportRequest {
    @NotBlank(message = "Incident category is required.")
    @Size(max = 80)
    private String eventType;

    @Size(max = 1000)
    private String incidentOverview;

    @NotBlank(message = "Incident description is required.")
    @Size(max = 5000)
    private String description;

    @NotBlank(message = "Incident location is required.")
    @Size(max = 500)
    private String loc;

    @NotNull(message = "Incident date and time is required.")
    @PastOrPresent(message = "Incident date and time cannot be in the future as the event must have already occurred.")
    private LocalDateTime dateTime;

    private Double latitude;
    private Double longitude;

    private OfficialRequest initialOfficial;

    private String photoData;
    private String photoName;
    private String keyphrase;
    private String powChallenge;
    private String powNonce;
    private String threatLevel;
    private String importance;

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
    public Double getLatitude(){ return latitude; }
    public void setLatitude(Double latitude){ this.latitude = latitude; }
    public Double getLongitude(){ return longitude; }
    public void setLongitude(Double longitude){ this.longitude = longitude; }
    public OfficialRequest getInitialOfficial(){ return initialOfficial; }
    public void setInitialOfficial(OfficialRequest initialOfficial){ this.initialOfficial = initialOfficial; }
    public String getPhotoData(){ return photoData; }
    public void setPhotoData(String photoData){ this.photoData = photoData; }
    public String getPhotoName(){ return photoName; }
    public void setPhotoName(String photoName){ this.photoName = photoName; }
    public String getKeyphrase(){ return keyphrase; }
    public void setKeyphrase(String keyphrase){ this.keyphrase = keyphrase; }
    public String getPowChallenge() { return powChallenge; }
    public void setPowChallenge(String powChallenge) { this.powChallenge = powChallenge; }
    public String getPowNonce() { return powNonce; }
    public void setPowNonce(String powNonce) { this.powNonce = powNonce; }
    public String getThreatLevel() { return threatLevel; }
    public void setThreatLevel(String threatLevel) { this.threatLevel = threatLevel; }
    public String getImportance() { return importance; }
    public void setImportance(String importance) { this.importance = importance; }
}