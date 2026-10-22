package com.example.backend;

import com.example.backend.model.Report;
import com.example.backend.model.User;
import com.example.backend.service.ConfidenceEvaluationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

public class ConfidenceEvaluationServiceTest {

    private ConfidenceEvaluationService service;
    private Report sampleReport;

    @BeforeEach
    void setUp() {
        service = new ConfidenceEvaluationService();
        sampleReport = new Report();
        sampleReport.setId(1L);
        sampleReport.setEventType("Theft");
        sampleReport.setDescription("Black Honda Activa scooter stolen outside supermarket near Indiranagar metro station.");
        sampleReport.setLoc("Indiranagar, Bangalore");
        sampleReport.setLatitude(12.9784);
        sampleReport.setLongitude(77.6408);
        sampleReport.setDateTime(LocalDateTime.now().minusHours(2));

        User reporter = new User();
        reporter.setUsername("victim1");
        sampleReport.setReporter(reporter);
    }

    @Test
    void testHaversineDistanceCalculation() {
        // Distance between two points near Indiranagar (~0.5km)
        double distance = ConfidenceEvaluationService.haversine(12.9784, 77.6408, 12.9790, 77.6415);
        assertTrue(distance > 0.0 && distance < 1.0, "Distance should be under 1 km");
    }

    @Test
    void testHighConfidenceWhenCloseAndKeywordsMatch() {
        // Contributor is 0.2km away and mentions scooter, black, Indiranagar, stolen
        ConfidenceEvaluationService.ConfidenceResult result = service.evaluate(
                sampleReport,
                "I saw a person pushing a black scooter without keys near Indiranagar metro station heading towards 100ft road.",
                "100ft Road, Indiranagar",
                12.9790,
                77.6415
        );

        assertTrue(result.getScore() >= 75, "Expected high confidence score (>= 75), got: " + result.getScore());
        assertEquals("HIGH", result.getLevel());
        assertNotNull(result.getDistanceKm());
        assertTrue(result.getDistanceKm() < 1.0);
        assertTrue(result.getMatchNotes().contains("proximity") || result.getMatchNotes().contains("High description match"));
    }

    @Test
    void testLowerConfidenceWhenFarAwayAndFewKeywords() {
        // Contributor is ~50km away and gives unrelated generic text
        ConfidenceEvaluationService.ConfidenceResult result = service.evaluate(
                sampleReport,
                "Saw some suspicious activity somewhere.",
                "Distant Outskirts",
                13.4000,
                78.1000
        );

        assertTrue(result.getScore() < 60, "Expected lower score for distant location, got: " + result.getScore());
        assertTrue(result.getDistanceKm() > 40.0);
    }

    @Test
    void testTextLocationMatchWhenNoGps() {
        // No GPS provided, but location text matches "Indiranagar"
        ConfidenceEvaluationService.ConfidenceResult result = service.evaluate(
                sampleReport,
                "I was at Indiranagar market and noticed a black scooter abandoned near the corner.",
                "Indiranagar market",
                null,
                null
        );

        assertNull(result.getDistanceKm());
        assertTrue(result.getScore() >= 50);
        assertTrue(result.getMatchNotes().contains("location"));
    }
}

