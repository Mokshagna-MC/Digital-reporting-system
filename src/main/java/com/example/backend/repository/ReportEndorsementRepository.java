package com.example.backend.repository;

import com.example.backend.model.ReportEndorsement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReportEndorsementRepository extends JpaRepository<ReportEndorsement, Long> {
    List<ReportEndorsement> findByReportIdOrderByCreatedAtDesc(Long reportId);

    Optional<ReportEndorsement> findByReportIdAndUserId(Long reportId, Long userId);

    boolean existsByReportIdAndUserId(Long reportId, Long userId);

    long countByReportId(Long reportId);

    long countByUserId(Long userId);

    void deleteByReportIdAndUserId(Long reportId, Long userId);
}

