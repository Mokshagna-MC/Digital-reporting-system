package com.example.backend.repository;

import com.example.backend.model.Evidence;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EvidenceRepository extends JpaRepository<Evidence, Long> {
    List<Evidence> findByReportIdOrderByUploadedAtDesc(Long reportId);
    List<Evidence> findAllByOrderByUploadedAtDesc();
    long countByReportId(Long reportId);
}

