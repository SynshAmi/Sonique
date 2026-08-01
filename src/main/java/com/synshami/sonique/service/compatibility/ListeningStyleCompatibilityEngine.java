package com.synshami.sonique.service.compatibility;

import com.synshami.sonique.dto.compatibility.CompatibilityMetricResponse;
import com.synshami.sonique.dto.compatibility.ListeningStyleCompatibilityResponse;
import com.synshami.sonique.entity.User;
import com.synshami.sonique.entity.UserProfile;
import com.synshami.sonique.enums.TimeWindow;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ListeningStyleCompatibilityEngine {

    private static final double NORMALIZED_METRIC_RANGE = 1.0;
    private static final double TRACK_AGE_DECAY = 15.0;

    public ListeningStyleCompatibilityResponse compare(User userA, User userB) {

        UserProfile profileA = userA.getUserProfile();
        UserProfile profileB = userB.getUserProfile();

        double explorationSimilarity = calculateNormalizedSimilarity(
                profileA.getExplorationScore(),
                profileB.getExplorationScore(),
                NORMALIZED_METRIC_RANGE
        );

        double artistDiversitySimilarity = calculateNormalizedSimilarity(
                profileA.getArtistDiversityScore(),
                profileB.getArtistDiversityScore(),
                NORMALIZED_METRIC_RANGE
        );

        double trackAgeSimilarity = calculateTrackAgeSimilarity(
                profileA.getAverageTrackAge(),
                profileB.getAverageTrackAge()
        );

        double timeWindowSimilarity = calculateTimeWindowSimilarity(
                profileA.getDominantTimeWindow(),
                profileB.getDominantTimeWindow()
        );

        CompatibilityMetricResponse exploration =
                CompatibilityMetricResponse.builder()
                        .metricName("Exploration")
                        .userAValue(format(profileA.getExplorationScore()))
                        .userBValue(format(profileB.getExplorationScore()))
                        .similarity(round(explorationSimilarity))
                        .build();

        CompatibilityMetricResponse artistDiversity =
                CompatibilityMetricResponse.builder()
                        .metricName("Artist Diversity")
                        .userAValue(format(profileA.getArtistDiversityScore()))
                        .userBValue(format(profileB.getArtistDiversityScore()))
                        .similarity(round(artistDiversitySimilarity))
                        .build();

        CompatibilityMetricResponse averageTrackAge =
                CompatibilityMetricResponse.builder()
                        .metricName("Average Track Age")
                        .userAValue(format(profileA.getAverageTrackAge()))
                        .userBValue(format(profileB.getAverageTrackAge()))
                        .similarity(round(trackAgeSimilarity))
                        .build();

        CompatibilityMetricResponse dominantTimeWindow =
                CompatibilityMetricResponse.builder()
                        .metricName("Dominant Time Window")
                        .userAValue(profileA.getDominantTimeWindow().name())
                        .userBValue(profileB.getDominantTimeWindow().name())
                        .similarity(round(timeWindowSimilarity))
                        .build();

        List<CompatibilityMetricResponse> metrics = List.of(
                exploration,
                artistDiversity,
                averageTrackAge,
                dominantTimeWindow
        );

        double compatibilityScore =
                (explorationSimilarity
                        + artistDiversitySimilarity
                        + trackAgeSimilarity
                        + timeWindowSimilarity) / 4.0;

        return ListeningStyleCompatibilityResponse.builder()
                .compatibilityScore(round(compatibilityScore))
                .metrics(metrics)
                .build();
    }

    private String format(double value) {
        return String.format("%.2f", value);
    }

    private double round(double value) {
        return Math.round(value * 100.0) / 100.0;
    }

    private double calculateNormalizedSimilarity(double valueA,
                                                 double valueB,
                                                 double range) {

        double difference = Math.abs(valueA - valueB);

        double similarity = 1 - (difference / range);

        return Math.max(0, similarity);
    }

    private double calculateTrackAgeSimilarity(double ageA, double ageB) {
        double difference = Math.abs(ageA - ageB);
        return Math.exp(-difference / TRACK_AGE_DECAY);
    }

    private int getWindowIndex(TimeWindow window) {
        return switch (window) {
            case MORNING -> 0;
            case AFTERNOON -> 1;
            case EVENING -> 2;
            case NIGHT -> 3;
        };
    }

    private double calculateTimeWindowSimilarity(TimeWindow windowA,
                                                 TimeWindow windowB) {

        int indexA = getWindowIndex(windowA);
        int indexB = getWindowIndex(windowB);

        int directDistance = Math.abs(indexA - indexB);
        int circularDistance = Math.min(directDistance, 4 - directDistance);

        return 1 - (circularDistance / 2.0);
    }
}