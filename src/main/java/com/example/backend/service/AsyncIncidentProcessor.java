package com.example.backend.service;

import com.example.backend.model.AuditLog;
import com.example.backend.model.Report;
import com.example.backend.repository.AuditLogRepository;
import com.example.backend.repository.ReportRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.CompletableFuture;

/**
 * Asynchronous incident background processor for high-traffic scalability.
 * Frees up main HTTP request thread immediately by processing geo-corroboration
 * calculations and access logs asynchronously.
 */
@Service
public class AsyncIncidentProcessor {
    private static final Logger log = LoggerFactory.getLogger(AsyncIncidentProcessor.class);

    private final AuditLogRepository auditLogs;
    private final ReportRepository reports;

    public AsyncIncidentProcessor(AuditLogRepository auditLogs, ReportRepository reports) {
        this.auditLogs = auditLogs;
        this.reports = reports;
    }

    /**
     * Asynchronously log sensitive narrative view events under zero-blocking thread execution.
     */
    @Async
    public CompletableFuture<Void> recordViewAuditAsync(Long reportId, String username, String role, String referenceCode) {
        try {
            AuditLog al = new AuditLog();
            al.setReportId(reportId);
            al.setAction("SENSITIVE_REPORT_VIEWED");
            al.setPerformedBy(username);
            al.setUserRole(role);
            al.setDetails(String.format("User %s (%s) accessed confidential case narrative of %s",
                    username, role, referenceCode));
            al.setTimestamp(LocalDateTime.now());
            auditLogs.save(al);
            log.debug("Asynchronously recorded view audit for report #{}", reportId);
        } catch (Exception e) {
            log.error("Async view audit error for report #{}: {}", reportId, e.getMessage());
        }
        return CompletableFuture.completedFuture(null);
    }

    /**
     * Asynchronously compute Haversine spatial corroboration across nearby incidents.
     */
    @Async
    public CompletableFuture<Void> computeHaversineCorroborationAsync(Long reportId, Double lat, Double lng, String category) {
        if (lat == null || lng == null) {
            return CompletableFuture.completedFuture(null);
        }
        try {
            LocalDateTime cutoff = LocalDateTime.now().minusHours(48);
            List<Report> recent = reports.findByCreatedAtAfterOrderByCreatedAtDesc(cutoff);
            int nearbyCorroboratedCount = 0;

            for (Report other : recent) {
                if (other.getId().equals(reportId) || other.getLatitude() == null || other.getLongitude() == null) {
                    continue;
                }
                double distKm = haversine(lat, lng, other.getLatitude(), other.getLongitude());
                if (distKm <= 1.5) { // within 1.5km
                    nearbyCorroboratedCount++;
                }
            }

            if (nearbyCorroboratedCount > 0) {
                log.info("Async Haversine analysis for report #{}: found {} nearby corroborating cases",
                        reportId, nearbyCorroboratedCount);
            }
        } catch (Exception e) {
            log.error("Async Haversine computation error for report #{}: {}", reportId, e.getMessage());
        }
        return CompletableFuture.completedFuture(null);
    }

    private double haversine(double lat1, double lon1, double lat2, double lon2) {
        final double R = 6371.0; // Earth radius in km
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
}
