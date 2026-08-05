package com.synshami.sonique.service;

import com.synshami.sonique.dto.auth.RegisterResponse;
import com.synshami.sonique.dto.user.UserResponse;
import com.synshami.sonique.entity.User;

import com.synshami.sonique.exception.AuthenticationException;
import com.synshami.sonique.exception.DuplicateResourceException;
import com.synshami.sonique.exception.ResourceNotFoundException;
import com.synshami.sonique.repository.ListeningHistoryRepository;
import com.synshami.sonique.repository.SpotifyTokenRepository;
import com.synshami.sonique.repository.UserProfileRepository;
import com.synshami.sonique.repository.UserRepository;
import com.synshami.sonique.repository.UserTagPreferenceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.synshami.sonique.dto.auth.LoginResponse;
import com.synshami.sonique.security.JwtService;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final UserTagPreferenceRepository userTagPreferenceRepository;
    private final ListeningHistoryRepository listeningHistoryRepository;
    private final UserProfileRepository userProfileRepository;
    private final SpotifyTokenRepository spotifyTokenRepository;

    public RegisterResponse register(String email,
                                     String username,
                                     String displayName,
                                     String password) {

        if (userRepository.existsByEmail(email)) {
            throw new DuplicateResourceException("Email already in use");
        }

        if (userRepository.existsByUsername(username)) {
            throw new DuplicateResourceException("Username already taken");
        }

        String hashedPassword = passwordEncoder.encode(password);

        User user = User.builder()
                .email(email)
                .username(username)
                .displayName(displayName)
                .passwordHash(hashedPassword)
                .createdAt(LocalDateTime.now())
                .build();

        User savedUser = userRepository.save(user);

        return RegisterResponse.builder()
                .id(savedUser.getId())
                .email(savedUser.getEmail())
                .username(savedUser.getUsername())
                .displayName(savedUser.getDisplayName())
                .build();
    }

    public LoginResponse login(String email, String password) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AuthenticationException("Invalid email or password"));

        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new AuthenticationException("Invalid email or password");
        }

        String token = jwtService.generateToken(
                user.getId(),
                user.getUsername()
        );

        return LoginResponse.builder()
                .token(token)
                .build();
    }

    public UserResponse getUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .username(user.getUsername())
                .displayName(user.getDisplayName())
                .build();
    }

    @Transactional
    public void deleteAccount(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        userTagPreferenceRepository.deleteByUserId(userId);
        listeningHistoryRepository.deleteByUserId(userId);
        userProfileRepository.deleteByUserId(userId);
        spotifyTokenRepository.deleteByUserId(userId);
        userRepository.delete(user);
    }
}