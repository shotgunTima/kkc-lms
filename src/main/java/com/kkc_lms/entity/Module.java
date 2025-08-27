package com.kkc_lms.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "modules")
@Data
public class Module {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(length = 2000)
    private String description;

    @ManyToOne
    @JoinColumn(name = "semester_id")
    private Semester semester;
}
