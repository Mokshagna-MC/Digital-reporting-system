package com.example.backend.repository;

import com.example.backend.model.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ReportRepository extends JpaRepository<Report, Long> {
    List<Report> findAllByOrderByCreatedAtDesc();
    List<Report> findByCreatedAtAfterOrderByCreatedAtDesc(LocalDateTime cutoff);
    List<Report> findByReporterIdOrderByCreatedAtDesc(Long reporterId);
    List<Report> findByStatusIgnoreCaseOrderByCreatedAtDesc(String status);
    List<Report> findByReporterIdAndStatusIgnoreCaseOrderByCreatedAtDesc(Long reporterId, String status);
    Optional<Report> findByReferenceCodeIgnoreCase(String referenceCode);
    Optional<Report> findByAnonymousSessionToken(String anonymousSessionToken);
}

