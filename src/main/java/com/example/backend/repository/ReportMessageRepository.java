package com.example.backend.repository;

import com.example.backend.model.ReportMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReportMessageRepository extends JpaRepository<ReportMessage, Long> {
    List<ReportMessage> findByReportIdOrderByCreatedAtAsc(Long reportId);
    long countByReportIdAndSenderTypeAndReadByReporterFalse(Long reportId, String senderType);
    long countByReportIdAndSenderTypeAndReadByAuthorityFalse(Long reportId, String senderType);
}
