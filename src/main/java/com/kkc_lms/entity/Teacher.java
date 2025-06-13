package com.kkc_lms.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

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

    @Column(name = "academic_title", nullable = false)
    private String academicTitle;

    @ManyToOne
    @JoinColumn(name = "departament_id", nullable = false)
    private Department department;

    @Column(name = "hire_date", nullable = false)
    private LocalDate hireDate;
}
