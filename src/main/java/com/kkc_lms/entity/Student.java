package com.kkc_lms.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "students")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "student_id_number", nullable = false, unique = true)
    private String studentIdNumber;

    //дирекшн
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "direction_id")
    private Direction direction;

    @ManyToOne
    @JoinColumn(name = "group_id")
    private Group group;

    @Column(name = "total_credits")
    private int totalCredits;

    @Column(name = "admission_year", nullable = false)
    private int admissionYear;

    @Column(name = "contract_paid", nullable = false)
    private boolean contractPaid;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private StudentStatus status;

    @Enumerated(EnumType.STRING)
    @Column(name = "course")
    private Course course;



}
