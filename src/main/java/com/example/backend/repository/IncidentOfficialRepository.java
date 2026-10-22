package com.example.backend.repository;

import com.example.backend.model.IncidentOfficial;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface IncidentOfficialRepository extends JpaRepository<IncidentOfficial, Long> {
    List<IncidentOfficial> findByReportIdOrderByArrivalTimeAscRecordedAtAsc(Long reportId);
    List<IncidentOfficial> findByReportIdAndFirstReportTakerTrue(Long reportId);
    List<IncidentOfficial> findAllByOrderByRecordedAtDesc();
    long countByReportId(Long reportId);
}

