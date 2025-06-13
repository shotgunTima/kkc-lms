package com.kkc_lms.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.Data;

@Entity
@Data
@Table(name = "users")


public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, unique = true)
    private String email;

    private String fullname;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {//ставит текущую дату есчо
        this.createdAt = LocalDateTime.now();
    }

    @Column(name = "last_login")
    private LocalDateTime lastLogin;

    @Column(name = "profile_image")
    private String profileImage;

    @Column(length = 13, unique = true)
    private String phonenum;

    private String address;
}
