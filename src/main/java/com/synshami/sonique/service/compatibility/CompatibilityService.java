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

    public CompatibilityResponse compare(Long currentUserId, String targetUsername)
    {
        User currentUser = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        User targetUser = userRepository.findByUsernameIgnoreCase(targetUsername)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (currentUser.getId().equals(targetUser.getId())) {
            throw new IllegalArgumentException("You cannot compare compatibility with yourself.");
        }

        TasteCompatibilityResponse tasteCompatibility =
                tasteCompatibilityEngine.compare(currentUser, targetUser);

        ListeningStyleCompatibilityResponse listeningStyleCompatibility =
                listeningStyleCompatibilityEngine.compare(currentUser, targetUser);

        double overallCompatibility =
                round(
                        tasteCompatibility.getCompatibilityScore() * TASTE_WEIGHT +
                                listeningStyleCompatibility.getCompatibilityScore() * LISTENING_STYLE_WEIGHT
                );

        String summary = null;

        try {

            summary = geminiCompatibilityService.generateSummary(
                    currentUser,
                    targetUser,
                    tasteCompatibility,
                    listeningStyleCompatibility,
                    overallCompatibility
            );

        } catch (Exception e) {

            logger.error(
                    "Failed to generate compatibility summary for user {} comparing with {}",
                    currentUserId,
                    targetUsername,
                    e
            );
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
