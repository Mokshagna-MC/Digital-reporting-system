package com.example.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Enterprise CORS & Transport Security Configuration.
 * Restricts cross-origin resource sharing to trusted application origins.
 */
@Configuration
public class WebSecurityConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOriginPatterns("http://localhost:[*]", "http://127.0.0.1:[*]", "https://*.onrender.com", "https://*.railway.app", "https://*.vercel.app", "https://*")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
                .allowedHeaders("*")
                .exposedHeaders("Authorization", "X-Auth-Token", "X-Accessible-Report-Id", "X-Anonymous-Session-Token", "Set-Cookie")
                .allowCredentials(true)
                .maxAge(3600);
    }
}

