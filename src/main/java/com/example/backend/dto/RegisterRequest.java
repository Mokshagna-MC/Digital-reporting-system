package com.example.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class RegisterRequest {
    @NotBlank(message = "Username is required.")
    @Size(min = 3, max = 120, message = "Username must be between 3 and 120 characters.")
    private String username;

    @NotBlank(message = "Email is required.")
    @Size(max = 180, message = "Email cannot exceed 180 characters.")
    @Pattern(
        regexp = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,63}$",
        message = "Please provide a valid email address (e.g. user@example.com)."
    )
    private String email;

    @NotBlank(message = "Password is required.")
    @Pattern(
        regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?~`]).{8,100}$",
        message = "Password must be at least 8 characters long and contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character."
    )
    private String password;

    private String role = "CITIZEN"; // CITIZEN, JOURNALIST, GOVERNMENT_OFFICIAL, ORGANIZATION

    public String getUsername(){ return username; }
    public void setUsername(String username){ this.username = username; }
    public String getEmail(){ return email; }
    public void setEmail(String email){ this.email = email; }
    public String getPassword(){ return password; }
    public void setPassword(String password){ this.password = password; }
    public String getRole(){ return role; }
    public void setRole(String role){ this.role = role; }
}
