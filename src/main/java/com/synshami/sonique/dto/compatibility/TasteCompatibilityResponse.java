package com.synshami.sonique.dto.compatibility;

import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TasteCompatibilityResponse {

    private double compatibilityScore;

    private List<SharedPreferenceResponse> sharedGenres;
    private List<SharedPreferenceResponse> sharedMusicalTraits;
    private List<SharedPreferenceResponse> sharedVocalCharacteristics;

    private List<UniquePreferenceResponse> uniquePreferences;

}
