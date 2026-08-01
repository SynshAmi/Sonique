package com.synshami.sonique.service.compatibility;

import com.synshami.sonique.dto.compatibility.ListeningStyleCompatibilityResponse;
import com.synshami.sonique.entity.User;
import com.synshami.sonique.entity.UserProfile;
import com.synshami.sonique.enums.TimeWindow;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;


class ListeningStyleCompatibilityEngineTest {

    private ListeningStyleCompatibilityEngine engine;

    @BeforeEach
    void setUp() {
        engine = new ListeningStyleCompatibilityEngine();
    }

    @Test
    void identicalUsersShouldReturnPerfectCompatibility() {

        User userA = buildUser(
                0.75,
                0.60,
                8.0,
                TimeWindow.NIGHT
        );

        User userB = buildUser(
                0.75,
                0.60,
                8.0,
                TimeWindow.NIGHT
        );

        ListeningStyleCompatibilityResponse response =
                engine.compare(userA, userB);

        assertNotNull(response);

        assertEquals(1.0, response.getCompatibilityScore());

        assertEquals(4, response.getMetrics().size());

        for (var metric : response.getMetrics()) {
            assertEquals(1.0, metric.getSimilarity());
        }
    }

    @Test
    void comparisonShouldBeSymmetric() {

        User userA = buildUser(
                0.80,
                0.60,
                5.0,
                TimeWindow.MORNING
        );

        User userB = buildUser(
                0.40,
                0.90,
                12.0,
                TimeWindow.EVENING
        );

        ListeningStyleCompatibilityResponse responseAB =
                engine.compare(userA, userB);

        ListeningStyleCompatibilityResponse responseBA =
                engine.compare(userB, userA);

        assertEquals(
                responseAB.getCompatibilityScore(),
                responseBA.getCompatibilityScore()
        );

        for (int i = 0; i < responseAB.getMetrics().size(); i++) {
            assertEquals(
                    responseAB.getMetrics().get(i).getSimilarity(),
                    responseBA.getMetrics().get(i).getSimilarity()
            );
        }
    }

    @Test
    void explorationSimilarityShouldDecreaseLinearly() {

        User userA = buildUser(
                1.0,
                0.5,
                10,
                TimeWindow.NIGHT
        );

        User userB = buildUser(
                0.6,
                0.5,
                10,
                TimeWindow.NIGHT
        );

        ListeningStyleCompatibilityResponse response =
                engine.compare(userA, userB);

        assertEquals(
                0.60,
                response.getMetrics().get(0).getSimilarity()
        );
    }

    @Test
    void artistDiversitySimilarityShouldDecreaseLinearly() {

        User userA = buildUser(
                0.5,
                1.0,
                10,
                TimeWindow.NIGHT
        );

        User userB = buildUser(
                0.5,
                0.7,
                10,
                TimeWindow.NIGHT
        );

        ListeningStyleCompatibilityResponse response =
                engine.compare(userA, userB);

        assertEquals(
                0.70,
                response.getMetrics().get(1).getSimilarity()
        );
    }

    @Test
    void trackAgeSimilarityShouldUseExponentialDecay() {

        User userA = buildUser(
                0.5,
                0.5,
                5,
                TimeWindow.NIGHT
        );

        User userB = buildUser(
                0.5,
                0.5,
                20,
                TimeWindow.NIGHT
        );

        ListeningStyleCompatibilityResponse response =
                engine.compare(userA, userB);

        double expected = Math.round(Math.exp(-1) * 100.0) / 100.0;

        assertEquals(
                expected,
                response.getMetrics().get(2).getSimilarity()
        );
    }

    @Test
    void adjacentTimeWindowsShouldReturnHalfSimilarity() {

        User userA = buildUser(
                0.5,
                0.5,
                10,
                TimeWindow.MORNING
        );

        User userB = buildUser(
                0.5,
                0.5,
                10,
                TimeWindow.AFTERNOON
        );

        ListeningStyleCompatibilityResponse response =
                engine.compare(userA, userB);

        assertEquals(
                0.5,
                response.getMetrics().get(3).getSimilarity()
        );
    }

    @Test
    void oppositeTimeWindowsShouldReturnZeroSimilarity() {

        User userA = buildUser(
                0.5,
                0.5,
                10,
                TimeWindow.MORNING
        );

        User userB = buildUser(
                0.5,
                0.5,
                10,
                TimeWindow.EVENING
        );

        ListeningStyleCompatibilityResponse response =
                engine.compare(userA, userB);

        assertEquals(
                0.0,
                response.getMetrics().get(3).getSimilarity()
        );
    }

    @Test
    void responseShouldContainCorrectMetricInformation() {

        User userA = buildUser(
                0.53,
                0.82,
                7,
                TimeWindow.NIGHT
        );

        User userB = buildUser(
                0.53,
                0.82,
                7,
                TimeWindow.NIGHT
        );

        ListeningStyleCompatibilityResponse response =
                engine.compare(userA, userB);

        assertEquals(
                "Exploration",
                response.getMetrics().get(0).getMetricName()
        );

        assertEquals(
                "0.53",
                response.getMetrics().get(0).getUserAValue()
        );

        assertEquals(
                "Artist Diversity",
                response.getMetrics().get(1).getMetricName()
        );

        assertEquals(
                "Average Track Age",
                response.getMetrics().get(2).getMetricName()
        );

        assertEquals(
                "Dominant Time Window",
                response.getMetrics().get(3).getMetricName()
        );

        assertEquals(
                "NIGHT",
                response.getMetrics().get(3).getUserAValue()
        );
    }

    private User buildUser(
            double exploration,
            double artistDiversity,
            double averageTrackAge,
            TimeWindow timeWindow
    ) {
        UserProfile profile = new UserProfile();
        profile.setExplorationScore(exploration);
        profile.setArtistDiversityScore(artistDiversity);
        profile.setAverageTrackAge(averageTrackAge);
        profile.setDominantTimeWindow(timeWindow);

        User user = new User();
        user.setUserProfile(profile);
        profile.setUser(user);

        return user;
    }
}