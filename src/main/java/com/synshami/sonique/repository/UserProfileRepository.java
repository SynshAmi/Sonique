package com.synshami.sonique.repository;

import com.synshami.sonique.entity.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {
    @Modifying
    @Query("""
        DELETE FROM UserProfile u
        WHERE u.user.id = :userId
""")
    void deleteByUserId(@Param("userId") Long userId);
}

