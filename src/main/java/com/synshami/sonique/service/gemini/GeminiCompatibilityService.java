package com.synshami.sonique.service.gemini;

import com.synshami.sonique.dto.compatibility.ListeningStyleCompatibilityResponse;
import com.synshami.sonique.dto.compatibility.SharedPreferenceResponse;
import com.synshami.sonique.dto.compatibility.TasteCompatibilityResponse;
import com.synshami.sonique.dto.compatibility.UniquePreferenceResponse;
import com.synshami.sonique.dto.gemini.*;
import com.synshami.sonique.entity.User;
import com.synshami.sonique.dto.compatibility.CompatibilityMetricResponse;
import com.synshami.sonique.enums.PreferenceOwner;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GeminiCompatibilityService {

    private final GeminiService geminiService;

    public String generateSummary(
            User userA,
            User userB,
            TasteCompatibilityResponse musicalTasteCompatibility,
            ListeningStyleCompatibilityResponse listeningStyleCompatibility,
            double overallCompatibility
    ) {

        String prompt = buildPrompt(
                userA,
                userB,
                musicalTasteCompatibility,
                listeningStyleCompatibility,
                overallCompatibility
        );

        GenerateContentRequest request = buildRequest(prompt);

        GenerateContentResponse response =
                geminiService.generateContent(request);

        return extractSummary(response);
    }

    private GenerateContentRequest buildRequest(String prompt) {

        Part part = new Part(prompt);

        Content content = new Content(
                List.of(part),
                "user"
        );

        GenerationConfig generationConfig =
                new GenerationConfig("text/plain");

        return new GenerateContentRequest(
                List.of(content),
                generationConfig
        );
    }

    private String extractSummary(GenerateContentResponse response) {

        if (response == null
                || response.getCandidates() == null
                || response.getCandidates().isEmpty()) {
            return null;
        }

        Candidate candidate = response.getCandidates().get(0);

        if (candidate.getContent() == null
                || candidate.getContent().getParts() == null
                || candidate.getContent().getParts().isEmpty()) {
            return null;
        }

        return candidate.getContent()
                .getParts()
                .get(0)
                .getText();
    }

    private String buildPrompt(
            User userA,
            User userB,
            TasteCompatibilityResponse musicalTasteCompatibility,
            ListeningStyleCompatibilityResponse listeningStyleCompatibility,
            double overallCompatibility
    ) {

        StringBuilder prompt = new StringBuilder();

        prompt.append("""
            You are Sonique.

            Sonique writes like a music-obsessed friend sizing up two people's listening habits.

            ## Sonique's Two-Dimensional Model

            LISTENING STYLE = HOW someone listens
            - Exploration: How much they wander into new or unfamiliar music
            - Artist Diversity: Whether they focus on a few artists or range widely
            - Average Track Age: Whether they favor older established music or newer releases
            - Dominant Time Window: When they tend to listen

            MUSICAL TASTE = WHAT someone listens to
            - Shared Genres: Genres they both enjoy
            - Shared Musical Traits: Musical characteristics they both appreciate
            - Shared Vocal Characteristics: Vocal styles they both prefer
            - Unique Preferences: What each person brings distinctly to the table

            Do not blur these dimensions. A genre itself is not evidence of a listening habit.

            ## Voice

            - Conversational, playful, a little witty and confident — not clinical.
            - Sound like a friend who knows music, not an analyst or corporate blurb.
            - Keep it grounded in the supplied data.

            ## Reasoning Rules

            - Every meaningful observation must be grounded in the supplied metrics or preferences.
              Phrase the observation naturally rather than literally repeating the metric.
            - Mention similarities first, then note the interesting differences.
            - Do not make claims about personal life, relationships, emotions, or future behavior.
            - Do not explain the compatibility algorithm or list numeric scores.

            ## Understanding Normalized Values

            Some metrics are provided as normalized decimal values:
            - 0.80 = approximately 80%
            - 0.54 = approximately 54%
            - 0.42 = approximately 42%

            These values are for reasoning only and must NEVER appear in the final summary.

            Average Track Age is NOT a percentage and must be interpreted according to the
            actual value supplied (e.g., years, or as directly provided).

            ## Users
            """);

        prompt.append("\n")
                .append(userA.getDisplayName())
                .append(" (User A)");

        prompt.append("\n")
                .append(userB.getDisplayName())
                .append(" (User B)");

        prompt.append("\n\n## Compatibility Data");

        // Provide listening-style metrics (exploration, artist diversity, avg track age, time window)
        prompt.append("\nListening Style Metrics:\n");
        if (listeningStyleCompatibility.getMetrics() != null) {
            for (CompatibilityMetricResponse metric : listeningStyleCompatibility.getMetrics()) {
                prompt.append("- ")
                        .append(metric.getMetricName())
                        .append(": ")
                        .append(metric.getUserAValue())
                        .append(" | ")
                        .append(metric.getUserBValue())
                        .append("\n");
            }
        }

        prompt.append("\nShared Genres:\n")
                .append(formatSharedPreferences(
                        musicalTasteCompatibility.getSharedGenres()));

        prompt.append("\nShared Musical Traits:\n")
                .append(formatSharedPreferences(
                        musicalTasteCompatibility.getSharedMusicalTraits()));

        prompt.append("\nShared Vocal Characteristics:\n")
                .append(formatSharedPreferences(
                        musicalTasteCompatibility.getSharedVocalCharacteristics()));

        prompt.append("\nUnique Preferences:\n")
                .append(formatUniquePreferences(
                        musicalTasteCompatibility.getUniquePreferences()));

        prompt.append("""

            ## Tone Examples

            Good:
            You two listen in similar ways — one of you digs deep down rabbit holes while the other treats discovery like a hobby; that contrast is the fun part.

            Good:
            Both of you wander more than you settle, but one leans older while the other chases the new — same curiosity, different lanes.

            Write in a similar friendly, confident style. Keep references grounded in the provided metrics and preferences.

                ## Final Instructions
                - Maximum 70 words.
                - Never mention numerical scores.
                - Mention at most TWO specific genres, artists, or traits in total; do not enumerate genres.
                - Focus on listening personality and behavior (exploration, artist diversity, track age, time window).
                - Keep every statement grounded in the supplied data.
                - Return ONLY the summary as a single plain-text paragraph with no Markdown or extra formatting.""");

        return prompt.toString();
    }

    private String formatSharedPreferences(
            List<SharedPreferenceResponse> preferences) {

        if (preferences.isEmpty()) {
            return "None\n";
        }

        StringBuilder builder = new StringBuilder();

        for (SharedPreferenceResponse preference : preferences) {

            builder.append("- ")
                    .append(preference.getPreference())
                    .append(" (")
                    .append(preference.getMatchType())
                    .append(")\n");
        }

        return builder.toString();
    }

    private String formatUniquePreferences(
            List<UniquePreferenceResponse> preferences) {

        if (preferences.isEmpty()) {
            return "None\n";
        }

        StringBuilder builder = new StringBuilder();

        builder.append("User A:\n");

        int userACount = 0;

        for (UniquePreferenceResponse preference : preferences) {

            if (preference.getOwner() == PreferenceOwner.USER_A) {

                builder.append("- ")
                        .append(preference.getPreference())
                        .append("\n");

                userACount++;

                if (userACount == 5) {
                    break;
                }
            }
        }

        builder.append("\nUser B:\n");

        int userBCount = 0;

        for (UniquePreferenceResponse preference : preferences) {

            if (preference.getOwner() == PreferenceOwner.USER_B) {

                builder.append("- ")
                        .append(preference.getPreference())
                        .append("\n");

                userBCount++;

                if (userBCount == 5) {
                    break;
                }
            }
        }

        return builder.toString();
    }
}
