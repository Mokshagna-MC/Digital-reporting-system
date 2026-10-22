package com.example.backend.dto;

public class ReportUpdateRequest {
    private String description;
    private String incidentOverview;
    private String loc;
    private Double latitude;
    private Double longitude;
    private String photoData;
    private String photoName;
    private String keyphrase;

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getIncidentOverview() { return incidentOverview; }
    public void setIncidentOverview(String incidentOverview) { this.incidentOverview = incidentOverview; }

    public String getLoc() { return loc; }
    public void setLoc(String loc) { this.loc = loc; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public String getPhotoData() { return photoData; }
    public void setPhotoData(String photoData) { this.photoData = photoData; }

    public String getPhotoName() { return photoName; }
    public void setPhotoName(String photoName) { this.photoName = photoName; }

    public String getKeyphrase() { return keyphrase; }
    public void setKeyphrase(String keyphrase) { this.keyphrase = keyphrase; }
}
