package com.kkc_lms.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "registration_sessions")
@Data
public class RegistrationSession {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "semester_id")
    private Semester semester;
    @ManyToOne(optional = false)
    @JoinColumn(name = "direction_id")
    private Direction direction;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Course course;

    // год автоматически из semester.getYear()
    private Integer year;

    private LocalDateTime openedAt;

    private boolean open = true;

    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RegistrationSlot> slots = new ArrayList<>();
}
