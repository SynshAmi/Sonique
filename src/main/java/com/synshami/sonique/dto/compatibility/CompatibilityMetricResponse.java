package com.synshami.sonique.dto.compatibility;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CompatibilityMetricResponse {

    private String metricName;

    private String userAValue;

    private String userBValue;

    private double similarity;
}
