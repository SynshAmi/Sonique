package com.synshami.sonique.dto.compatibility;

import com.synshami.sonique.enums.PreferenceOwner;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UniquePreferenceResponse {

    private String preference;
    private double weight;
    private PreferenceOwner owner;
}
