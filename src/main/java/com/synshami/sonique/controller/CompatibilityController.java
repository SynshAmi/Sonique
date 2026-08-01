package com.synshami.sonique.controller;

import com.synshami.sonique.dto.compatibility.CompatibilityResponse;
import com.synshami.sonique.dto.compatibility.ListeningStyleCompatibilityResponse;
import com.synshami.sonique.dto.compatibility.TasteCompatibilityResponse;
import com.synshami.sonique.entity.User;
import com.synshami.sonique.repository.UserRepository;
import com.synshami.sonique.service.compatibility.CompatibilityService;
import com.synshami.sonique.service.compatibility.ListeningStyleCompatibilityEngine;
import com.synshami.sonique.service.compatibility.TasteCompatibilityEngine;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/compatibility")
@RequiredArgsConstructor
public class CompatibilityController {

    private final CompatibilityService compatibilityService;

    private final ListeningStyleCompatibilityEngine listeningStyleCompatibilityEngine;

    private final TasteCompatibilityEngine tasteCompatibilityEngine;

    private final UserRepository userRepository;

    @GetMapping("/{userAId}/{userBId}")
    public ResponseEntity<CompatibilityResponse> compare(
            @PathVariable Long userAId,
            @PathVariable Long userBId
    ) {

        return ResponseEntity.ok(
                compatibilityService.compare(userAId, userBId)
        );
    }
}