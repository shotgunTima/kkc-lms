package com.kkc_lms.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@Table(name = "teachers")
public class Teacher {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "academic_title")
    private String academicTitle;

    @Column(name = "hire_date", nullable = false)
    private LocalDate hireDate;

    @Enumerated(EnumType.STRING)
    private TeacherStatus status;

    public enum TeacherStatus {
        ACTIVE, ON_LEAVE, DISMISSED
    }

    @ManyToMany(mappedBy = "teachers")
    private List<Subject> subjects = new ArrayList<>();

}
