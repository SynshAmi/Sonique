package com.synshami.sonique.dto.compatibility;

import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ListeningStyleCompatibilityResponse {

    private double compatibilityScore;

    private List<CompatibilityMetricResponse> metrics;
}
