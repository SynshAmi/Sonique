package com.synshami.sonique.dto.compatibility;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CompatibilityResponse {

    private double overallCompatibility;

    private ListeningStyleCompatibilityResponse listeningStyleCompatibility;

    private TasteCompatibilityResponse musicalTasteCompatibility;

    private String summary;
}
