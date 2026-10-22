package com.example.backend.repository;

import com.example.backend.model.ReportContribution;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReportContributionRepository extends JpaRepository<ReportContribution, Long> {
    List<ReportContribution> findByReportIdOrderByCreatedAtDesc(Long reportId);
    List<ReportContribution> findAllByOrderByCreatedAtDesc();
    List<ReportContribution> findByContributorIdOrderByCreatedAtDesc(Long contributorId);
    long countByReportId(Long reportId);
}

