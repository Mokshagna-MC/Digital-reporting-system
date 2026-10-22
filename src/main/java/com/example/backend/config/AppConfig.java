package com.example.backend.config;

import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AppConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CommandLineRunner seedDefaultUsers(UserRepository userRepository, PasswordEncoder passwordEncoder, JdbcTemplate jdbcTemplate) {
        return args -> {
            try {
                jdbcTemplate.execute("ALTER TABLE reports ALTER COLUMN reporter_id DROP NOT NULL;");
            } catch (Exception ignored) {}

            if (userRepository.findByUsername("admin").isEmpty()) {
                User admin = new User();
                admin.setUsername("admin");
                admin.setEmail("admin@borcelle.org");
                admin.setPasswordHash(passwordEncoder.encode("Admin@2026Password!"));
                admin.setRole("ADMIN");
                admin.setBadgeNumber("ADM-001");
                admin.setDepartmentOrOrg("Directorate of Public Safety & Audit");
                admin.setDesignation("Chief System Administrator");
                admin.setContactNumber("+1-555-019-9000");
                admin.setVerificationStatus("VERIFIED_ACTIVE");
                admin.setEmailVerified(true);
                admin.setCredentialsNotes("Primary root administrator with full oversight, audit review, and system supervisory authority.");
                userRepository.save(admin);
            }
        };
    }
}
