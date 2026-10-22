package com.example.backend.service;

import com.example.backend.model.Report;
import com.example.backend.model.Witness;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class WitnessVerificationService {

    private static final Set<String> STOP_WORDS = Set.of(
            "the", "and", "a", "an", "in", "on", "at", "to", "for", "of", "with",
            "is", "was", "were", "are", "be", "been", "it", "this", "that", "there",
            "i", "me", "my", "we", "our", "you", "he", "she", "they", "them", "from",
            "by", "as", "or", "have", "had", "has", "about", "into", "also", "some", "saw"
    );

    private static final Pattern WORD_PATTERN = Pattern.compile("[^a-zA-Z0-9]+");

    public static class VerificationOutcome {
        private final String status; // CONSISTENT, NEEDS_REVIEW, INCONSISTENT, INITIAL_RECORD
        private final int score;
        private final String notes;

        public VerificationOutcome(String status, int score, String notes) {
            this.status = status;
            this.score = score;
            this.notes = notes;
        }

        public String getStatus() { return status; }
        public int getScore() { return score; }
        public String getNotes() { return notes; }
    }

    public VerificationOutcome verifyWitnessStatement(Report report, List<Witness> priorWitnesses, Witness newWitness) {
        // If this is the initial source witness recorded at report creation
        if ("INITIAL_SOURCE".equalsIgnoreCase(newWitness.getWitnessType())) {
            return new VerificationOutcome(
                    "INITIAL_RECORD",
                    100,
                    "Initial source account recorded at report creation. Serves as baseline reference statement for subsequent witness comparisons."
            );
        }

        int score = 20; // Base score for independent witness submission
        List<String> consistencyPoints = new ArrayList<>();
        List<String> discrepancies = new ArrayList<>();

        // 1. Location Consistency
        Set<String> reportLocTokens = extractTokens(report.getLoc());
        Set<String> witnessLocTokens = extractTokens(
                (newWitness.getLocationObserved() != null ? newWitness.getLocationObserved() : "") + " " + newWitness.getStatement()
        );

        long locMatchCount = witnessLocTokens.stream().filter(reportLocTokens::contains).count();
        if (locMatchCount >= 2) {
            score += 35;
            consistencyPoints.add("Location strongly consistent with incident scene (" + locMatchCount + " matching landmarks/areas)");
        } else if (locMatchCount == 1) {
            score += 25;
            consistencyPoints.add("Location consistent with incident district/area");
        } else if (newWitness.getLocationObserved() != null && !newWitness.getLocationObserved().isBlank()) {
            score += 10;
            consistencyPoints.add("Specific location observed was provided");
        } else {
            discrepancies.add("Observed location was omitted or does not mention scene area");
        }

        // 2. Timing Consistency
        if (newWitness.getTimeObserved() != null && report.getDateTime() != null) {
            long diffMinutes = Math.abs(Duration.between(newWitness.getTimeObserved(), report.getDateTime()).toMinutes());
            if (diffMinutes <= 60) {
                score += 30;
                consistencyPoints.add(String.format("Timing highly consistent (within %d mins of reported incident time)", diffMinutes));
            } else if (diffMinutes <= 180) {
                score += 20;
                consistencyPoints.add(String.format("Timing reasonably consistent (within %d hours of incident time)", (diffMinutes / 60) + 1));
            } else if (diffMinutes <= 720) {
                score += 5;
                discrepancies.add(String.format("Timing discrepancy: observed time differs by %d hours from report", diffMinutes / 60));
            } else {
                score -= 20;
                discrepancies.add(String.format("Major timing conflict: observed time differs by %d hours from incident time", diffMinutes / 60));
            }
        } else {
            score += 10; // Neutral
        }

        // 3. Event Description & Keyword Alignment
        StringBuilder baselineText = new StringBuilder();
        baselineText.append(report.getEventType()).append(" ").append(report.getDescription());
        for (Witness pw : priorWitnesses) {
            baselineText.append(" ").append(pw.getStatement());
        }

        Set<String> baselineTokens = extractTokens(baselineText.toString());
        Set<String> witnessTokens = extractTokens(newWitness.getStatement());

        List<String> matchingWords = witnessTokens.stream()
                .filter(baselineTokens::contains)
                .sorted()
                .toList();

        if (matchingWords.size() >= 4) {
            score += 30;
            consistencyPoints.add("Event details consistent (matched key terms: " + String.join(", ", matchingWords.stream().limit(5).toList()) + ")");
        } else if (matchingWords.size() >= 2) {
            score += 18;
            consistencyPoints.add("Moderate event detail overlap (matched: " + String.join(", ", matchingWords) + ")");
        } else {
            score += 5;
            discrepancies.add("Statement mentions few overlapping details with prior accounts");
        }

        // Clamp score between 0 and 100
        int finalScore = Math.max(5, Math.min(100, score));

        // Determine Consistency Status
        String status;
        if (finalScore >= 75) {
            status = "CONSISTENT";
        } else if (finalScore >= 45) {
            status = "NEEDS_REVIEW";
        } else {
            status = "INCONSISTENT";
        }

        // Build comprehensive explanation
        StringBuilder notesBuilder = new StringBuilder();
        if (!consistencyPoints.isEmpty()) {
            notesBuilder.append("Consistent aspects: ").append(String.join("; ", consistencyPoints)).append(". ");
        }
        if (!discrepancies.isEmpty()) {
            notesBuilder.append("Discrepancies noted: ").append(String.join("; ", discrepancies)).append(". ");
        }
        notesBuilder.append("[Note: Consistency scoring assists human review and does not establish witness authenticity.]");

        return new VerificationOutcome(status, finalScore, notesBuilder.toString());
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

