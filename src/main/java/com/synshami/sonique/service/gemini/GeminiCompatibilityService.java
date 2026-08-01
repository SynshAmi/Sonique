package com.synshami.sonique.service.gemini;

import com.synshami.sonique.dto.compatibility.ListeningStyleCompatibilityResponse;
import com.synshami.sonique.dto.compatibility.SharedPreferenceResponse;
import com.synshami.sonique.dto.compatibility.TasteCompatibilityResponse;
import com.synshami.sonique.dto.compatibility.UniquePreferenceResponse;
import com.synshami.sonique.dto.gemini.*;
import com.synshami.sonique.entity.User;
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

            Sonique is a music platform that explains WHY two people are musically compatible.

            ## Sonique's Philosophy

            Compatibility is measured using two independent dimensions.

            1. Musical Taste Compatibility
            This reflects how similar two users' musical identities are.
            It is based on:
            - Shared genres
            - Shared musical traits
            - Shared vocal characteristics
            - Unique preferences
            - Hierarchical genre relationships

            2. Listening Style Compatibility
            This reflects how similarly two users experience music.
            It is based on:
            - Exploration tendency
            - Artist diversity
            - Average track age
            - Preferred listening time

            The overall compatibility combines both dimensions.

            ## Sonique Voice

            Talk like you're explaining this to a friend who's into music.

            - Keep the language simple.
            - Be conversational.
            - Be expressive without trying too hard.
            - Don't sound like an analyst.
            - Don't sound corporate.
            - Don't sound like ChatGPT.
            - Sound human.

            Avoid phrases like:
            - common ground
            - stems from
            - foundational tastes
            - primarily driven by
            - demonstrates
            - indicates
            - suggests

            Use natural wording instead.

            ## Reasoning Rules

            Every meaningful sentence MUST be backed by the supplied data.

            Never invent:
            - genres
            - artists
            - preferences
            - listening habits
            - personality traits
            - friendship
            - romance
            - future behaviour

            Never make predictions.

            Explain WHY the compatibility exists instead of paraphrasing the data.

            Mention similarities first, then explain the differences.

            If differences exist, explain what makes them interesting instead of treating them like negatives.

            Use the users' display names naturally instead of saying
            "User A", "User B", or "one of you".

            ## Users
            """);

        prompt.append("\n")
                .append(userA.getDisplayName())
                .append(" (User A)");

        prompt.append("\n")
                .append(userB.getDisplayName())
                .append(" (User B)");

        prompt.append("\n\n## Compatibility Data");

        prompt.append("\nOverall Compatibility: ")
                .append(Math.round(overallCompatibility * 100))
                .append("%");

        prompt.append("\nTaste Compatibility: ")
                .append(Math.round(
                        musicalTasteCompatibility.getCompatibilityScore() * 100))
                .append("%");

        prompt.append("\nListening Style Compatibility: ")
                .append(Math.round(
                        listeningStyleCompatibility.getCompatibilityScore() * 100))
                .append("%");

        prompt.append("\n\nShared Genres:\n")
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
            "You guys both keep coming back to Hip Hop, but that's pretty much where your paths split. Suryansh dives into heavier sounds while Aman leans more towards Jazz and Soul. What's cool is that even with different tastes, you both seem to experience music in a surprisingly similar way."

            Good:
            "This isn't one of those matches where everything lines up perfectly, and honestly that's what makes it interesting. You overlap in the right places, but both of you still bring something completely different to the table."

            Good:
            "You clearly don't listen to the exact same music, but you approach music in a really similar way. That's doing a lot of the heavy lifting here, while your different tastes keep things interesting."

            Write in a similar style.

            Don't copy these examples.

            ## Final Instructions

            - Maximum 70 words.
            - Never mention numerical scores.
            - Mention specific genres or traits whenever relevant.
            - Keep every statement grounded in the supplied data.
            - Return ONLY the summary.
            """);

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
