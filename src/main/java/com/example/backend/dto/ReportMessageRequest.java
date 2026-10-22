package com.example.backend.dto;

import jakarta.validation.constraints.NotBlank;

public class ReportMessageRequest {
    @NotBlank(message = "Message text cannot be blank.")
    private String messageText;

    private String keyphrase;

    public String getMessageText() { return messageText; }
    public void setMessageText(String messageText) { this.messageText = messageText; }

    public String getKeyphrase() { return keyphrase; }
    public void setKeyphrase(String keyphrase) { this.keyphrase = keyphrase; }
}
