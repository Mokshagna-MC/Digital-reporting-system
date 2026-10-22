package com.example.backend.service;

import com.example.backend.model.Report;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class ConfidenceEvaluationService {

    private static final Set<String> STOP_WORDS = Set.of(
            "the", "and", "a", "an", "in", "on", "at", "to", "for", "of", "with",
            "is", "was", "were", "are", "be", "been", "it", "this", "that", "there",
            "i", "me", "my", "we", "our", "you", "he", "she", "they", "them", "from",
            "by", "as", "or", "have", "had", "has", "about", "into", "also", "some"
    );

    private static final Pattern WORD_PATTERN = Pattern.compile("[^a-zA-Z0-9]+");

    public static class ConfidenceResult {
        private final int score;
        private final String level;
        private final Double distanceKm;
        private final String matchNotes;

        public ConfidenceResult(int score, String level, Double distanceKm, String matchNotes) {
            this.score = score;
            this.level = level;
            this.distanceKm = distanceKm;
            this.matchNotes = matchNotes;
        }

        public int getScore() { return score; }
        public String getLevel() { return level; }
        public Double getDistanceKm() { return distanceKm; }
        public String getMatchNotes() { return matchNotes; }
    }

    public ConfidenceResult evaluate(Report report, String infoText, String contributorLoc,
                                     Double contributorLat, Double contributorLng) {
        int score = 15; // Base confidence for registered submission
        List<String> notes = new ArrayList<>();
        Double distanceKm = null;

        // 1. Geolocation evaluation
        int geoScore = 0;
        if (contributorLat != null && contributorLng != null &&
            report.getLatitude() != null && report.getLongitude() != null) {
            distanceKm = haversine(report.getLatitude(), report.getLongitude(), contributorLat, contributorLng);
            // Format to 2 decimal places
            distanceKm = Math.round(distanceKm * 100.0) / 100.0;

            if (distanceKm <= 1.0) {
                geoScore = 45;
                notes.add(String.format("High proximity (%.2f km from incident scene)", distanceKm));
            } else if (distanceKm <= 3.0) {
                geoScore = 40;
                notes.add(String.format("Close vicinity (%.2f km from incident scene)", distanceKm));
            } else if (distanceKm <= 8.0) {
                geoScore = 30;
                notes.add(String.format("Same neighborhood/area (%.2f km away)", distanceKm));
            } else if (distanceKm <= 20.0) {
                geoScore = 20;
                notes.add(String.format("Within city radius (%.2f km away)", distanceKm));
            } else {
                geoScore = 5;
                notes.add(String.format("Distant location (%.2f km away)", distanceKm));
            }
        } else if (contributorLoc != null && !contributorLoc.isBlank() &&
                   report.getLoc() != null && !report.getLoc().isBlank()) {
            Set<String> reportLocWords = extractTokens(report.getLoc());
            Set<String> contribLocWords = extractTokens(contributorLoc);
            long matchingLocTokens = contribLocWords.stream().filter(reportLocWords::contains).count();
            if (matchingLocTokens >= 2) {
                geoScore = 35;
                notes.add("Stated location strongly matches incident area");
            } else if (matchingLocTokens == 1) {
                geoScore = 25;
                notes.add("Stated location matches incident district/area");
            } else {
                geoScore = 15;
                notes.add("Stated location provided (no coordinate verification)");
            }
        } else {
            notes.add("No location verification provided");
        }
        score += geoScore;

        // 2. Event and Description matching
        int descScore = 0;
        Set<String> reportKeywords = extractTokens(report.getEventType() + " " + report.getDescription());
        Set<String> contribWords = extractTokens(infoText);

        List<String> matchedTokens = contribWords.stream()
                .filter(reportKeywords::contains)
                .sorted()
                .toList();

        if (matchedTokens.size() >= 4) {
            descScore += 35;
            notes.add("High description match (keywords: " + String.join(", ", matchedTokens.stream().limit(5).toList()) + ")");
        } else if (matchedTokens.size() >= 2) {
            descScore += 25;
            notes.add("Partial description overlap (keywords: " + String.join(", ", matchedTokens) + ")");
        } else if (matchedTokens.size() == 1) {
            descScore += 15;
            notes.add("Minor keyword overlap (" + matchedTokens.get(0) + ")");
        } else {
            descScore += 5;
            notes.add("General witness observation without prior keyword overlap");
        }

        // Check if eventType category is explicitly referenced
        String eventTypeLower = report.getEventType().toLowerCase();
        if (infoText != null && infoText.toLowerCase().contains(eventTypeLower)) {
            descScore += 5;
        }
        score += descScore;

        // 3. Information detail quality
        if (infoText != null && infoText.trim().length() >= 50) {
            score += 10;
        } else if (infoText != null && infoText.trim().length() < 20) {
            score -= 10;
        }

        // Clamp between 10 and 100
        int finalScore = Math.max(10, Math.min(100, score));

        String level;
        if (finalScore >= 75) {
            level = "HIGH";
        } else if (finalScore >= 50) {
            level = "MEDIUM";
        } else {
            level = "LOW";
        }

        String matchNotes = String.join("; ", notes);
        return new ConfidenceResult(finalScore, level, distanceKm, matchNotes);
    }

    public static double haversine(double lat1, double lon1, double lat2, double lon2) {
        final double R = 6371.0; // Earth radius in km
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                 + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                 * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    private Set<String> extractTokens(String text) {
        if (text == null) return Collections.emptySet();
        return Arrays.stream(WORD_PATTERN.split(text.toLowerCase()))
                .map(String::trim)
                .filter(w -> w.length() > 2)
                .filter(w -> !STOP_WORDS.contains(w))
                .collect(Collectors.toSet());
    }
}

