package com.synshami.sonique.controller;

import com.synshami.sonique.dto.compatibility.CompatibilityResponse;
import com.synshami.sonique.service.compatibility.CompatibilityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/compatibility")
@RequiredArgsConstructor
public class CompatibilityController {

    private final CompatibilityService compatibilityService;

    @GetMapping("/{targetUsername}")
    public ResponseEntity<CompatibilityResponse> compare(
            @PathVariable String targetUsername
    ) {
        Long currentUserId = (Long) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        return ResponseEntity.ok(
                compatibilityService.compare(currentUserId, targetUsername)
        );
    }
}