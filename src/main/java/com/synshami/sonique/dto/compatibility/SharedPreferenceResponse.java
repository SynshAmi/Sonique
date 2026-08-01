package com.synshami.sonique.dto.compatibility;

import com.synshami.sonique.enums.MatchType;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SharedPreferenceResponse {

    private String preference;

    private double userAWeight;

    private double userBWeight;

    private MatchType matchType;

    private double contribution;
}
