package com.kkc_lms.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "groups")
public class Group {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @ManyToOne
    @JoinColumn(name = "departament_id", nullable = false)
    private Department department;

    @ManyToOne
    @JoinColumn(name = "curator_id", nullable = false)
    private Teacher curator;
}
