package com.synshami.sonique.service.compatibility;

import com.synshami.sonique.dto.compatibility.CompatibilityResponse;
import com.synshami.sonique.dto.compatibility.ListeningStyleCompatibilityResponse;
import com.synshami.sonique.dto.compatibility.TasteCompatibilityResponse;
import com.synshami.sonique.entity.User;
import com.synshami.sonique.exception.ResourceNotFoundException;
import com.synshami.sonique.repository.UserRepository;
import com.synshami.sonique.service.gemini.GeminiCompatibilityService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
@RequiredArgsConstructor
public class CompatibilityService {

    private final UserRepository userRepository;

    private final TasteCompatibilityEngine tasteCompatibilityEngine;

    private final ListeningStyleCompatibilityEngine listeningStyleCompatibilityEngine;

    private final GeminiCompatibilityService geminiCompatibilityService;

    private static final double TASTE_WEIGHT = 0.70;
    private static final double LISTENING_STYLE_WEIGHT = 0.30;

    private static final Logger logger =
            LoggerFactory.getLogger(CompatibilityService.class);

    public CompatibilityResponse compare(Long userAId, Long userBId)
    {
        User userA = userRepository.findById(userAId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        User userB = userRepository.findById(userBId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        TasteCompatibilityResponse tasteCompatibility =
                tasteCompatibilityEngine.compare(userA, userB);

        ListeningStyleCompatibilityResponse listeningStyleCompatibility =
                listeningStyleCompatibilityEngine.compare(userA, userB);

        double overallCompatibility =
                round(
                        tasteCompatibility.getCompatibilityScore() * TASTE_WEIGHT +
                                listeningStyleCompatibility.getCompatibilityScore() * LISTENING_STYLE_WEIGHT
                );

        String summary = null;

        try {

            summary = geminiCompatibilityService.generateSummary(
                    userA,
                    userB,
                    tasteCompatibility,
                    listeningStyleCompatibility,
                    overallCompatibility
            );

        } catch (Exception e) {

            logger.error("Failed to generate compatibility summary", e);
        }

        return CompatibilityResponse.builder()
                .overallCompatibility(overallCompatibility)
                .musicalTasteCompatibility(tasteCompatibility)
                .listeningStyleCompatibility(listeningStyleCompatibility)
                .summary(summary)
                .build();
    }

    private double round(double value) {
        return Math.round(value * 1000.0) / 1000.0;
    }

}
