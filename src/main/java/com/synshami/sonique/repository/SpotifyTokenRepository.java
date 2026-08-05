package com.synshami.sonique.repository;

import com.synshami.sonique.entity.SpotifyToken;
import com.synshami.sonique.enums.SpotifyConnectionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface SpotifyTokenRepository extends JpaRepository<SpotifyToken, Long> {

    Optional<SpotifyToken> findBySpotifyUserId(String spotifyUserId);

    Optional<SpotifyToken> findByUserId(Long userId);

    List<SpotifyToken> findAllByConnectionStatus(SpotifyConnectionStatus connectionStatus);

    boolean existsBySpotifyUserId(String spotifyUserId);

    Optional<SpotifyToken> findTopByOrderByIdAsc();

    @Modifying
    @Query("""
        DELETE FROM SpotifyToken t
        WHERE t.user.id = :userId
""")
    void deleteByUserId(@Param("userId") Long userId);
}