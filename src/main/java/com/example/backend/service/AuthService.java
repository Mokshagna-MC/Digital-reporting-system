package com.example.backend.service;

import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Base64;

/**
 * Enterprise Dual-Mode Authentication Service.
 * Bridges stateless cryptographic bearer tokens with session cookies.
 * Guarantees cross-origin Vercel-to-Render compatibility even when
 * third-party cookies are blocked by modern browsers.
 */
@Service
public class AuthService {

    private final UserRepository userRepository;
    private static final String TOKEN_SECRET = "DRS_ENTERPRISE_HMAC_SECRET_KEY_2026_SIGNING";
    private static final long TOKEN_VALIDITY_MS = 30L * 24 * 60 * 60 * 1000; // 30 days

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Stateless cryptographically signed authentication token.
     * Survives application restarts, load balancers, and cross-origin boundaries.
     */
    public String generateToken(User user) {
        if (user == null || user.getId() == null) return null;
        long now = System.currentTimeMillis();
        String payload = user.getId() + ":" + user.getRole() + ":" + now;
        String signature = computeSignature(payload);
        String rawToken = payload + ":" + signature;
        return Base64.getUrlEncoder().withoutPadding().encodeToString(rawToken.getBytes(StandardCharsets.UTF_8));
    }

    public User verifyAndGetUser(String token) {
        if (token == null || token.isBlank()) return null;
        try {
            String clean = token.trim();
            if (clean.toLowerCase().startsWith("bearer ")) {
                clean = clean.substring(7).trim();
            }
            byte[] decoded = Base64.getUrlDecoder().decode(clean);
            String raw = new String(decoded, StandardCharsets.UTF_8);
            String[] parts = raw.split(":");
            if (parts.length != 4) return null;

            String userIdStr = parts[0];
            String role = parts[1];
            String timestampStr = parts[2];
            String receivedSig = parts[3];

            long timestamp = Long.parseLong(timestampStr);
            if (System.currentTimeMillis() - timestamp > TOKEN_VALIDITY_MS) {
                return null; // Expired
            }

            String expectedSig = computeSignature(userIdStr + ":" + role + ":" + timestampStr);
            if (!expectedSig.equals(receivedSig)) {
                return null; // Tampered token
            }

            Long userId = Long.parseLong(userIdStr);
            return userRepository.findById(userId).orElse(null);
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * Resolves the current authenticated user from either:
     * 1. Authorization header (Bearer <token>)
     * 2. X-Auth-Token header
     * 3. HttpSession (JSESSIONID cookie fallback)
     */
    public User getCurrentUser(HttpSession session) {
        HttpServletRequest request = getCurrentHttpRequest();
        if (request != null) {
            String authHeader = request.getHeader("Authorization");
            if (authHeader != null && !authHeader.isBlank()) {
                User u = verifyAndGetUser(authHeader);
                if (u != null) return u;
            }

            String tokenHeader = request.getHeader("X-Auth-Token");
            if (tokenHeader != null && !tokenHeader.isBlank()) {
                User u = verifyAndGetUser(tokenHeader);
                if (u != null) return u;
            }
        }

        if (session != null) {
            Object id = session.getAttribute("userId");
            if (id instanceof Long userId) {
                return userRepository.findById(userId).orElse(null);
            }
        }

        return null;
    }

    public Long getAccessibleReportId(HttpSession session) {
        HttpServletRequest request = getCurrentHttpRequest();
        if (request != null) {
            String header = request.getHeader("X-Accessible-Report-Id");
            if (header != null && !header.isBlank()) {
                try {
                    return Long.parseLong(header.trim());
                } catch (Exception ignored) {}
            }
        }
        if (session != null) {
            Object accId = session.getAttribute("accessibleReportId");
            if (accId instanceof Long aid) return aid;
        }
        return null;
    }

    public String getAnonymousSessionToken(HttpSession session) {
        HttpServletRequest request = getCurrentHttpRequest();
        if (request != null) {
            String header = request.getHeader("X-Anonymous-Session-Token");
            if (header != null && !header.isBlank()) {
                return header.trim();
            }
        }
        if (session != null) {
            Object tok = session.getAttribute("anonymousSessionToken");
            if (tok instanceof String s) return s;
        }
        return null;
    }

    private HttpServletRequest getCurrentHttpRequest() {
        try {
            ServletRequestAttributes attrs = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            return attrs != null ? attrs.getRequest() : null;
        } catch (Exception e) {
            return null;
        }
    }

    private String computeSignature(String data) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hash = md.digest((data + ":" + TOKEN_SECRET).getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : hash) sb.append(String.format("%02x", b));
            return sb.toString().substring(0, 24);
        } catch (Exception e) {
            return "sig_err";
        }
    }
}
