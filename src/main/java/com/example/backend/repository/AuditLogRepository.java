package com.example.backend.repository;

import com.example.backend.model.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    List<AuditLog> findByReportIdOrderByTimestampDesc(Long reportId);
    List<AuditLog> findByReportIdAndActionOrderByTimestampDesc(Long reportId, String action);
    List<AuditLog> findAllByOrderByTimestampDesc();
    List<AuditLog> findTop100ByOrderByTimestampDesc();
    long countByReportId(Long reportId);
    long countByReportIdAndAction(Long reportId, String action);
}

