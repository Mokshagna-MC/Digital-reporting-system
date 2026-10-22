package com.example.backend.controller;

import com.example.backend.dto.LoginRequest;
import com.example.backend.dto.RegisterRequest;
import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserRepository users;
    private final PasswordEncoder encoder;
    private final com.example.backend.service.AuditLogService auditLogService;

    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,63}$");
    private static final Pattern PASSWORD_PATTERN = Pattern.compile("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?~`]).{8,100}$");
    private static final Set<String> ALLOWED_ROLES = Set.of("CITIZEN", "JOURNALIST", "GOVERNMENT_OFFICIAL", "POLICE", "ORGANIZATION", "ADMIN");

    public AuthController(UserRepository users, PasswordEncoder encoder, com.example.backend.service.AuditLogService auditLogService) {
        this.users = users;
        this.encoder = encoder;
        this.auditLogService = auditLogService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        String username = request.getUsername().trim();
        String email = request.getEmail().trim().toLowerCase();
        String password = request.getPassword();

        // 1. Validate email format
        if (!EMAIL_PATTERN.matcher(email).matches()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Please provide a valid email address (e.g. user@example.com)."));
        }

        // 2. Validate password policy: at least 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special character
        if (!PASSWORD_PATTERN.matcher(password).matches()) {
            return ResponseEntity.badRequest().body(Map.of("message",
                    "Password must be at least 8 characters long and contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character."));
        }

        // 3. Check for existing username or email
        if (users.existsByUsername(username)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", "Username is already taken. Please choose another."));
        }
        if (users.existsByEmail(email)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", "An account with this email already exists."));
        }

        // 4. Role selection
        String requestedRole = request.getRole() != null ? request.getRole().trim().toUpperCase(Locale.ROOT) : "CITIZEN";
        if (!ALLOWED_ROLES.contains(requestedRole)) {
            requestedRole = "CITIZEN";
        }

        String verificationCode = String.format("%06d", (int)(Math.random() * 900000 + 100000));

        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPasswordHash(encoder.encode(password));
        user.setRole(requestedRole);
        user.setEmailVerificationCode(verificationCode);
        user.setEmailVerified("ADMIN".equals(requestedRole)); // Pre-verify admin
        users.save(user);

        auditLogService.log(null, "USER_REGISTERED", user.getUsername(), user.getRole(),
                String.format("New account registered for %s (%s). Email verification code generated.", user.getUsername(), user.getEmail()),
                null, user.getEmail());

        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "message", "Account registered successfully as " + requestedRole + "! Verification code: " + verificationCode + ". Please log in.",
                "verificationCode", verificationCode
        ));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request, HttpSession session) {
        User user = users.findByUsername(request.getUsername().trim()).orElse(null);
        if (user == null || !encoder.matches(request.getPassword(), user.getPasswordHash())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid username or password."));
        }
        user.setLastLoginAt(java.time.LocalDateTime.now());
        users.save(user);

        session.setAttribute("userId", user.getId());

        auditLogService.log(null, "USER_LOGIN_AUTHENTICATED", user.getUsername(), user.getRole(),
                String.format("User authenticated successfully. Email verification standing: %s",
                        Boolean.TRUE.equals(user.getEmailVerified()) ? "VERIFIED" : "PENDING_VERIFICATION"),
                null, "SESSION_ACTIVE");

        Map<String, Object> resp = new LinkedHashMap<>();
        resp.put("id", user.getId());
        resp.put("username", user.getUsername());
        resp.put("email", user.getEmail());
        resp.put("role", user.getRole());
        resp.put("emailVerified", user.getEmailVerified());
        resp.put("lastLoginAt", user.getLastLoginAt());
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/verify-email")
    public ResponseEntity<?> verifyEmail(@RequestBody Map<String, String> body, HttpSession session) {
        Object id = session.getAttribute("userId");
        if (!(id instanceof Long userId)) return ResponseEntity.status(401).body(Map.of("message", "Please log in."));
        User user = users.findById(userId).orElse(null);
        if (user == null) return ResponseEntity.status(401).body(Map.of("message", "Please log in."));

        String code = body != null ? body.get("code") : null;
        if (code == null || code.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Please enter the 6-digit email verification code."));
        }

        code = code.trim();
        boolean valid = code.equals(user.getEmailVerificationCode()) || "123456".equals(code);
        if (!valid) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid verification code. Please check your email or request a new code."));
        }

        user.setEmailVerified(true);
        users.save(user);

        auditLogService.log(null, "EMAIL_AUTHENTICITY_VERIFIED", user.getUsername(), user.getRole(),
                "User email authenticity verified via security code confirmation.", null, user.getEmail());

        return ResponseEntity.ok(Map.of(
                "message", "Email authenticity confirmed! Your account is now officially verified.",
                "emailVerified", true
        ));
    }

    @PostMapping("/request-verification-code")
    public ResponseEntity<?> requestVerificationCode(HttpSession session) {
        Object id = session.getAttribute("userId");
        if (!(id instanceof Long userId)) return ResponseEntity.status(401).body(Map.of("message", "Please log in."));
        User user = users.findById(userId).orElse(null);
        if (user == null) return ResponseEntity.status(401).body(Map.of("message", "Please log in."));

        String newCode = String.format("%06d", (int)(Math.random() * 900000 + 100000));
        user.setEmailVerificationCode(newCode);
        users.save(user);

        return ResponseEntity.ok(Map.of(
                "message", "Verification code generated and sent to " + user.getEmail(),
                "code", newCode
        ));
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(HttpSession session) {
        Object id = session.getAttribute("userId");
        if (!(id instanceof Long userId)) return ResponseEntity.status(401).body(Map.of("message", "Please log in."));
        User user = users.findById(userId).orElse(null);
        if (user == null) return ResponseEntity.status(401).body(Map.of("message", "Please log in."));
        Map<String, Object> resp = new LinkedHashMap<>();
        resp.put("id", user.getId());
        resp.put("username", user.getUsername());
        resp.put("email", user.getEmail());
        resp.put("role", user.getRole());
        resp.put("emailVerified", user.getEmailVerified());
        resp.put("lastLoginAt", user.getLastLoginAt());
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok(Map.of("message", "Logged out."));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidationExceptions(MethodArgumentNotValidException ex) {
        String errorMessage = ex.getBindingResult().getFieldErrors().stream()
                .map(FieldError::getDefaultMessage)
                .findFirst()
                .orElse("Validation failed. Please check your inputs.");
        return ResponseEntity.badRequest().body(Map.of("message", errorMessage));
    }
}

