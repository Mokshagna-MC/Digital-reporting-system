package com.example.backend.security;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Enterprise DDoS & Brute-Force Rate Limiter utilizing Bucket4j.
 * Strictly limits incident report lodgement and secret keyphrase authentication attempts.
 */
@Component
@Order(1)
public class RateLimitingFilter implements Filter {

    // Token buckets partitioned by client identifier
    private final Map<String, Bucket> submissionBuckets = new ConcurrentHashMap<>();
    private final Map<String, Bucket> keyphraseAuthBuckets = new ConcurrentHashMap<>();

    private Bucket createSubmissionBucket() {
        // Max 5 submissions per minute with greedy refill
        Bandwidth limit = Bandwidth.classic(5, Refill.greedy(5, Duration.ofMinutes(1)));
        return Bucket.builder().addLimit(limit).build();
    }

    private Bucket createAuthBucket() {
        // Max 10 keyphrase authentication attempts per minute (brute-force defense)
        Bandwidth limit = Bandwidth.classic(10, Refill.greedy(10, Duration.ofMinutes(1)));
        return Bucket.builder().addLimit(limit).build();
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse res = (HttpServletResponse) response;

        String uri = req.getRequestURI();
        String method = req.getMethod();
        String clientKey = resolveClientKey(req);

        // 1. Rate-limit incident submissions (/api/reports POST)
        if ("POST".equalsIgnoreCase(method) && uri.equals("/api/reports")) {
            Bucket bucket = submissionBuckets.computeIfAbsent(clientKey, k -> createSubmissionBucket());
            if (!bucket.tryConsume(1)) {
                sendRateLimitExceeded(res, "Incident submission rate limit exceeded. Max 5 reports per minute.");
                return;
            }
        }

        // 2. Rate-limit keyphrase authentication (/api/reports/access-by-keyphrase POST)
        if ("POST".equalsIgnoreCase(method) && uri.contains("/access-by-keyphrase")) {
            Bucket bucket = keyphraseAuthBuckets.computeIfAbsent(clientKey, k -> createAuthBucket());
            if (!bucket.tryConsume(1)) {
                sendRateLimitExceeded(res, "Keyphrase authentication rate limit exceeded. Max 10 attempts per minute to prevent brute-force attacks.");
                return;
            }
        }

        chain.doFilter(request, response);
    }

    private String resolveClientKey(HttpServletRequest req) {
        String ip = req.getHeader("X-Forwarded-For");
        if (ip == null || ip.isBlank()) {
            ip = req.getRemoteAddr();
        }
        return (ip != null) ? ip.split(",")[0].trim() : "anonymous-client";
    }

    private void sendRateLimitExceeded(HttpServletResponse res, String message) throws IOException {
        res.setStatus(429); // HTTP 429 Too Many Requests
        res.setContentType("application/json");
        res.setCharacterEncoding("UTF-8");
        res.getWriter().write(String.format("{\"error\":\"Too Many Requests\",\"status\":429,\"message\":\"%s\"}", message));
    }
}
