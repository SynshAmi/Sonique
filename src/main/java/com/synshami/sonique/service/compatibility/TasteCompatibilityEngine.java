package com.synshami.sonique.service.compatibility;

import com.synshami.sonique.dto.compatibility.SharedPreferenceResponse;
import com.synshami.sonique.dto.compatibility.TasteCompatibilityResponse;
import com.synshami.sonique.dto.compatibility.UniquePreferenceResponse;
import com.synshami.sonique.entity.CanonicalTag;
import com.synshami.sonique.entity.User;
import com.synshami.sonique.entity.UserTagPreference;
import com.synshami.sonique.enums.CanonicalTagCategory;
import com.synshami.sonique.enums.MatchType;
import com.synshami.sonique.enums.PreferenceOwner;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class TasteCompatibilityEngine {

    private static final double PARENT_CHILD_MULTIPLIER = 0.80;
    private static final double SIBLING_MULTIPLIER = 0.70;
    private static final double DIVERGENCE_FACTOR = 0.25;

    private static final double GENRE_WEIGHT = 0.60;
    private static final double TRAIT_WEIGHT = 0.25;
    private static final double VOCAL_WEIGHT = 0.15;

    private static final double MIN_EXPLAINABLE_PREFERENCE_WEIGHT = 0.03;
    private static final int MAX_UNIQUE_PREFERENCES_PER_USER = 3;

    public TasteCompatibilityResponse compare(User userA, User userB) {

        Map<CanonicalTagCategory, List<UserTagPreference>> userAPreferences =
                groupByCategory(userA.getUserTagPreferences());

        Map<CanonicalTagCategory, List<UserTagPreference>> userBPreferences =
                groupByCategory(userB.getUserTagPreferences());

        CategoryComparisonResult genreResult = compareCategory(
                userAPreferences.getOrDefault(CanonicalTagCategory.GENRE, List.of()),
                userBPreferences.getOrDefault(CanonicalTagCategory.GENRE, List.of())
        );

        CategoryComparisonResult traitResult = compareCategory(
                userAPreferences.getOrDefault(CanonicalTagCategory.MUSICAL_TRAIT, List.of()),
                userBPreferences.getOrDefault(CanonicalTagCategory.MUSICAL_TRAIT, List.of())
        );

        CategoryComparisonResult vocalResult = compareCategory(
                userAPreferences.getOrDefault(CanonicalTagCategory.VOCAL_CHARACTERISTIC, List.of()),
                userBPreferences.getOrDefault(CanonicalTagCategory.VOCAL_CHARACTERISTIC, List.of())
        );

        double overallScore =
                genreResult.score() * GENRE_WEIGHT
                        + traitResult.score() * TRAIT_WEIGHT
                        + vocalResult.score() * VOCAL_WEIGHT;

        List<UniquePreferenceResponse> uniquePreferences = new ArrayList<>();

        uniquePreferences.addAll(genreResult.uniquePreferences());
        uniquePreferences.addAll(traitResult.uniquePreferences());
        uniquePreferences.addAll(vocalResult.uniquePreferences());

        // Filter unique preferences for explainability
        uniquePreferences = filterExplainablePreferences(uniquePreferences);

        return TasteCompatibilityResponse.builder()
                .compatibilityScore(round(overallScore))
                .sharedGenres(genreResult.sharedPreferences())
                .sharedMusicalTraits(traitResult.sharedPreferences())
                .sharedVocalCharacteristics(vocalResult.sharedPreferences())
                .uniquePreferences(uniquePreferences)
                .build();
    }

    private Map<CanonicalTagCategory, List<UserTagPreference>> groupByCategory(
            List<UserTagPreference> preferences) {

        Map<CanonicalTagCategory, List<UserTagPreference>> groupedPreferences = new HashMap<>();

        for (UserTagPreference preference : preferences) {

            CanonicalTagCategory category = preference.getTag().getCategory();

            if (!groupedPreferences.containsKey(category)) {
                groupedPreferences.put(category, new ArrayList<>());
            }

            groupedPreferences.get(category).add(preference);
        }

        return groupedPreferences;
    }

    private CategoryComparisonResult compareCategory(
            List<UserTagPreference> userA,
            List<UserTagPreference> userB) {

        double score = 0.0;

        List<SharedPreferenceResponse> sharedPreferences = new ArrayList<>();
        List<UniquePreferenceResponse> uniquePreferences = new ArrayList<>();

        Set<Long> matchedUserAPreferences = new HashSet<>();
        Set<Long> matchedUserBPreferences = new HashSet<>();

        for (UserTagPreference preferenceA : userA) {

            MatchResult match = findBestMatch(
                    preferenceA,
                    userB,
                    matchedUserBPreferences
            );

            if (match != null) {

                matchedUserAPreferences.add(preferenceA.getId());
                matchedUserBPreferences.add(match.preference().getId());

                double contribution = calculateSharedContribution(
                        preferenceA,
                        match.preference(),
                        match.matchType()
                );

                score += contribution;

                if (round(contribution) > 0) {

                    sharedPreferences.add(
                            SharedPreferenceResponse.builder()
                                    .preference(preferenceA.getTag().getName())
                                    .userAWeight(preferenceA.getWeight())
                                    .userBWeight(match.preference().getWeight())
                                    .matchType(match.matchType())
                                    .contribution(round(contribution))
                                    .build()
                    );
                }
            }
        }

        List<UserTagPreference> unmatchedA = new ArrayList<>();

        for (UserTagPreference preference : userA) {

            if (!matchedUserAPreferences.contains(preference.getId())) {

                unmatchedA.add(preference);

                uniquePreferences.add(
                        UniquePreferenceResponse.builder()
                                .preference(preference.getTag().getName())
                                .weight(preference.getWeight())
                                .owner(PreferenceOwner.USER_A)
                                .build()
                );
            }
        }

        List<UserTagPreference> unmatchedB = new ArrayList<>();

        for (UserTagPreference preference : userB) {

            if (!matchedUserBPreferences.contains(preference.getId())) {

                unmatchedB.add(preference);

                uniquePreferences.add(
                        UniquePreferenceResponse.builder()
                                .preference(preference.getTag().getName())
                                .weight(preference.getWeight())
                                .owner(PreferenceOwner.USER_B)
                                .build()
                );
            }
        }

        double divergence = calculateDivergence(
                unmatchedA,
                unmatchedB
        );

        double finalScore = Math.max(0.0, score - divergence);

        sharedPreferences.sort(
                (a, b) -> Double.compare(
                        b.getContribution(),
                        a.getContribution()
                )
        );

        uniquePreferences.sort(
                (a, b) -> Double.compare(
                        b.getWeight(),
                        a.getWeight()
                )
        );

        double maximumPossibleScore = Math.min(
                getTotalWeight(userA),
                getTotalWeight(userB)
        );

        if (maximumPossibleScore == 0.0) {

            return new CategoryComparisonResult(
                    0.0,
                    sharedPreferences,
                    uniquePreferences
            );
        }

        return new CategoryComparisonResult(
                round(finalScore / maximumPossibleScore),
                sharedPreferences,
                uniquePreferences
        );
    }

    private MatchResult findBestMatch(
            UserTagPreference source,
            List<UserTagPreference> candidates,
            Set<Long> matchedPreferenceIds) {

        MatchResult parentChildMatch = null;
        double bestParentChildScore = -1;

        MatchResult siblingMatch = null;
        double bestSiblingScore = -1;

        for (UserTagPreference candidate : candidates) {

            if (matchedPreferenceIds.contains(candidate.getId())) {
                continue;
            }

            MatchType matchType = determineMatchType(
                    source.getTag(),
                    candidate.getTag()
            );

            if (matchType == null) {
                continue;
            }

            switch (matchType) {

                case EXACT:
                    return new MatchResult(candidate, MatchType.EXACT);

                case PARENT_CHILD:

                    double parentChildScore = Math.min(
                            source.getWeight(),
                            candidate.getWeight()
                    );

                    if (parentChildScore > bestParentChildScore) {

                        bestParentChildScore = parentChildScore;

                        parentChildMatch = new MatchResult(
                                candidate,
                                MatchType.PARENT_CHILD
                        );
                    }

                    break;

                case SIBLING:

                    double siblingScore = Math.min(
                            source.getWeight(),
                            candidate.getWeight()
                    );

                    if (siblingScore > bestSiblingScore) {

                        bestSiblingScore = siblingScore;

                        siblingMatch = new MatchResult(
                                candidate,
                                MatchType.SIBLING
                        );
                    }

                    break;
            }
        }

        if (parentChildMatch != null) {
            return parentChildMatch;
        }

        return siblingMatch;
    }

    private MatchType determineMatchType(
            CanonicalTag source,
            CanonicalTag target) {

        // Exact
        if (source.getId().equals(target.getId())) {
            return MatchType.EXACT;
        }

        // Parent-child
        if (source.getParent() != null &&
                source.getParent().getId().equals(target.getId())) {
            return MatchType.PARENT_CHILD;
        }

        if (target.getParent() != null &&
                target.getParent().getId().equals(source.getId())) {
            return MatchType.PARENT_CHILD;
        }

        // Siblings
        if (source.getParent() != null &&
                target.getParent() != null &&
                source.getParent().getId().equals(target.getParent().getId())) {
            return MatchType.SIBLING;
        }

        return null;
    }

    private double calculateSharedContribution(
            UserTagPreference userA,
            UserTagPreference userB,
            MatchType matchType) {

        double shared = Math.min(
                userA.getWeight(),
                userB.getWeight()
        );

        switch (matchType) {

            case EXACT:
                return shared * calculateSpecificityBonus(userA.getTag());

            case PARENT_CHILD:
                return shared * PARENT_CHILD_MULTIPLIER;

            case SIBLING:
                return shared * SIBLING_MULTIPLIER;

            default:
                return 0.0;
        }
    }

    private double calculateDivergence(
            List<UserTagPreference> unmatchedA,
            List<UserTagPreference> unmatchedB) {

        double divergence = 0.0;

        for (UserTagPreference preference : unmatchedA) {

            double weight = preference.getWeight();

            divergence += weight * weight;
        }

        for (UserTagPreference preference : unmatchedB) {

            double weight = preference.getWeight();

            divergence += weight * weight;
        }

        return divergence * DIVERGENCE_FACTOR;
    }

    private int getDepth(CanonicalTag tag) {

        int depth = 0;

        while (tag != null) {

            depth++;

            tag = tag.getParent();
        }

        return depth;
    }

    private double calculateSpecificityBonus(CanonicalTag tag) {

        int depth = getDepth(tag);

        return 1 + (depth - 1) * 0.02;
    }

    private double getTotalWeight(List<UserTagPreference> preferences) {

        double totalWeight = 0.0;

        for (UserTagPreference preference : preferences) {
            totalWeight += preference.getWeight();
        }

        return totalWeight;
    }

    private double round(double value) {
        return Math.round(value * 1000.0) / 1000.0;
    }

    private List<UniquePreferenceResponse> filterExplainablePreferences(
            List<UniquePreferenceResponse> preferences) {

        Map<PreferenceOwner, List<UniquePreferenceResponse>> byOwner = new HashMap<>();
        for (UniquePreferenceResponse pref : preferences) {
            byOwner.computeIfAbsent(pref.getOwner(), k -> new ArrayList<>())
                    .add(pref);
        }

        List<UniquePreferenceResponse> filtered = new ArrayList<>();

        for (Map.Entry<PreferenceOwner, List<UniquePreferenceResponse>> entry : byOwner.entrySet()) {
            List<UniquePreferenceResponse> ownerPreferences = entry.getValue();

            ownerPreferences.stream()
                    .filter(p -> p.getWeight() >= MIN_EXPLAINABLE_PREFERENCE_WEIGHT)
                    .sorted((a, b) -> Double.compare(b.getWeight(), a.getWeight()))
                    .limit(MAX_UNIQUE_PREFERENCES_PER_USER)
                    .forEach(filtered::add);
        }

        return filtered;
    }

    public record MatchResult(
            UserTagPreference preference,
            MatchType matchType
    ) {
    }

    private record CategoryComparisonResult(
            double score,
            List<SharedPreferenceResponse> sharedPreferences,
            List<UniquePreferenceResponse> uniquePreferences
    ) {
    }

}