package com.example.backend.repository;

import com.example.backend.model.Witness;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface WitnessRepository extends JpaRepository<Witness, Long> {
    List<Witness> findByReportIdOrderByCreatedAtDesc(Long reportId);
    List<Witness> findAllByOrderByCreatedAtDesc();
    long countByReportId(Long reportId);
}

