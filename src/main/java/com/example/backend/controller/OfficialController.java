package com.example.backend.controller;

import com.example.backend.dto.OfficialRequest;
import com.example.backend.model.IncidentOfficial;
import com.example.backend.model.Report;
import com.example.backend.model.User;
import com.example.backend.repository.IncidentOfficialRepository;
import com.example.backend.repository.ReportRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.AuditLogService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class OfficialController {
    private final IncidentOfficialRepository officialRepository;
    private final ReportRepository reports;
    private final UserRepository users;
    private final AuditLogService auditLogService;

    public OfficialController(IncidentOfficialRepository officialRepository,
                              ReportRepository reports,
                              UserRepository users,
                              AuditLogService auditLogService) {
        this.officialRepository = officialRepository;
        this.reports = reports;
        this.users = users;
        this.auditLogService = auditLogService;
    }

    @GetMapping("/officials")
    public ResponseEntity<?> getAllOfficials(HttpSession session) {
        User user = currentUser(session);
        if (user == null) return unauthorized();
        if (!isStaff(user)) {
            return ResponseEntity.status(403).body(Map.of("message", "Police/Admin access required."));
        }
        List<IncidentOfficial> list = officialRepository.findAllByOrderByRecordedAtDesc();
        return ResponseEntity.ok(list.stream().map(this::toMap).collect(Collectors.toList()));
    }

    @GetMapping("/reports/{id}/officials")
    public ResponseEntity<?> getOfficialsForReport(@PathVariable Long id, HttpSession session) {
        User user = currentUser(session);
        Report report = reports.findById(id).orElse(null);
        if (report == null) return ResponseEntity.notFound().build();

        boolean isStaffUser = user != null && isStaff(user);
        boolean isOwner = (user != null && report.getReporter() != null && report.getReporter().getId().equals(user.getId()))
                || Objects.equals(session.getAttribute("accessibleReportId"), id);

        // Allowed for staff or the reporter
        if (!isStaffUser && !isOwner) {
            return ResponseEntity.status(403).body(Map.of("message", "Forbidden."));
        }

        List<IncidentOfficial> list = officialRepository.findByReportIdOrderByArrivalTimeAscRecordedAtAsc(id);
        return ResponseEntity.ok(list.stream().map(this::toMap).collect(Collectors.toList()));
    }

    @PostMapping("/reports/{id}/officials")
    public ResponseEntity<?> addOfficial(@PathVariable Long id,
                                         @Valid @RequestBody OfficialRequest request,
                                         HttpSession session) {
        User user = currentUser(session);
        if (user == null) return unauthorized();
        if (!isStaff(user)) {
            return ResponseEntity.status(403).body(Map.of("message", "Police/Admin access required to register officials."));
        }
        Report report = reports.findById(id).orElse(null);
        if (report == null) return ResponseEntity.notFound().build();

        // If this official is marked as first report taker, check if one already exists
        if (request.isFirstReportTaker()) {
            List<IncidentOfficial> existingFirstTakers = officialRepository.findByReportIdAndFirstReportTakerTrue(id);
            for (IncidentOfficial prior : existingFirstTakers) {
                prior.setFirstReportTaker(false);
                officialRepository.save(prior);
            }
        }

        IncidentOfficial official = new IncidentOfficial();
        official.setReport(report);
        official.setOfficialName(request.getOfficialName().trim());
        official.setBadgeNumber(request.getBadgeNumber().trim());
        official.setDepartment(request.getDepartment().trim());
        official.setDesignation(request.getDesignation().trim());
        official.setContactInfo(request.getContactInfo() != null ? request.getContactInfo().trim() : null);
        official.setFirstReportTaker(request.isFirstReportTaker());
        official.setArrivalTime(request.getArrivalTime() != null ? request.getArrivalTime() : LocalDateTime.now());
        official.setDutiesSummary(request.getDutiesSummary() != null ? request.getDutiesSummary().trim() : null);
        official.setRecordedAt(LocalDateTime.now());
        official.setRecordedBy(user.getUsername());

        IncidentOfficial saved = officialRepository.save(official);

        // Record Audit Log
        String details = String.format("Assigned official %s (Badge: %s, %s - %s). First report taker: %s",
                saved.getOfficialName(), saved.getBadgeNumber(), saved.getDesignation(), saved.getDepartment(),
                saved.isFirstReportTaker() ? "YES" : "NO");

        auditLogService.log(id, "OFFICIAL_RECORDED", user.getUsername(), user.getRole(),
                details, null, saved.getOfficialName() + " (" + saved.getBadgeNumber() + ")");

        return ResponseEntity.ok(toMap(saved));
    }

    @DeleteMapping("/reports/{reportId}/officials/{officialId}")
    public ResponseEntity<?> removeOfficial(@PathVariable Long reportId,
                                            @PathVariable Long officialId,
                                            HttpSession session) {
        User user = currentUser(session);
        if (user == null) return unauthorized();
        if (!"ADMIN".equals(user.getRole())) {
            return ResponseEntity.status(403).body(Map.of("message", "Only administrators can remove official records."));
        }
        IncidentOfficial official = officialRepository.findById(officialId).orElse(null);
        if (official == null || !official.getReport().getId().equals(reportId)) {
            return ResponseEntity.notFound().build();
        }

        String name = official.getOfficialName();
        String badge = official.getBadgeNumber();
        officialRepository.delete(official);

        auditLogService.log(reportId, "OFFICIAL_REMOVED", user.getUsername(), user.getRole(),
                "Removed official record: " + name + " (Badge: " + badge + ")", name, null);

        return ResponseEntity.ok(Map.of("message", "Official record removed successfully."));
    }

    private User currentUser(HttpSession session) {
        Object id = session.getAttribute("userId");
        if (!(id instanceof Long userId)) return null;
        return users.findById(userId).orElse(null);
    }

    private boolean isStaff(User user) {
        return "POLICE".equals(user.getRole()) || "ADMIN".equals(user.getRole()) || "GOVERNMENT_OFFICIAL".equals(user.getRole());
    }

    private ResponseEntity<?> unauthorized() {
        return ResponseEntity.status(401).body(Map.of("message", "Please log in."));
    }

    private Map<String, Object> toMap(IncidentOfficial o) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", o.getId());
        m.put("reportId", o.getReport().getId());
        m.put("reportEventType", o.getReport().getEventType());
        m.put("reportLoc", o.getReport().getLoc());
        m.put("officialName", o.getOfficialName());
        m.put("badgeNumber", o.getBadgeNumber());
        m.put("department", o.getDepartment());
        m.put("designation", o.getDesignation());
        m.put("contactInfo", o.getContactInfo());
        m.put("firstReportTaker", o.isFirstReportTaker());
        m.put("arrivalTime", o.getArrivalTime());
        m.put("dutiesSummary", o.getDutiesSummary());
        m.put("recordedAt", o.getRecordedAt());
        m.put("recordedBy", o.getRecordedBy());
        return m;
    }
}

