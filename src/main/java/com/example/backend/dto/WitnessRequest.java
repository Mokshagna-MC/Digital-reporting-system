package com.example.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

public class WitnessRequest {
    @NotBlank(message = "Witness name is required.")
    @Size(max = 150)
    private String witnessName;

    @Size(max = 180)
    private String contactDetails;

    @NotBlank(message = "Witness statement is required.")
    @Size(max = 5000)
    private String statement;

    private String witnessType = "LATER_WITNESS"; // INITIAL_SOURCE or LATER_WITNESS

    @Size(max = 500)
    private String locationObserved;

    @PastOrPresent(message = "Observed time cannot be in the future.")
    private LocalDateTime timeObserved;

    public String getWitnessName() { return witnessName; }
    public void setWitnessName(String witnessName) { this.witnessName = witnessName; }

    public String getContactDetails() { return contactDetails; }
    public void setContactDetails(String contactDetails) { this.contactDetails = contactDetails; }

    public String getStatement() { return statement; }
    public void setStatement(String statement) { this.statement = statement; }

    public String getWitnessType() { return witnessType; }
    public void setWitnessType(String witnessType) { this.witnessType = witnessType; }

    public String getLocationObserved() { return locationObserved; }
    public void setLocationObserved(String locationObserved) { this.locationObserved = locationObserved; }

    public LocalDateTime getTimeObserved() { return timeObserved; }
    public void setTimeObserved(LocalDateTime timeObserved) { this.timeObserved = timeObserved; }
}

