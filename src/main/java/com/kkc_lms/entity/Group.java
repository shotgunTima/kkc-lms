package com.kkc_lms.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
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

    @ManyToOne(optional = false)
    @JoinColumn(name = "direction_id", nullable = false)
    @JsonIgnoreProperties("groups")
    private Direction direction;

    @ManyToOne
    @JoinColumn(name = "curator_id", nullable = true)
    private Teacher curator;

    @Column(name = "student_count", nullable = false)
    private int studentCount = 0;
}
