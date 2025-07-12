package com.kkc_lms.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Data
@Table(name = "directions")
public class Direction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @OneToMany(mappedBy = "direction", cascade = CascadeType.ALL)
    private List<Group> groups;

    @OneToMany(mappedBy = "direction")
    private List<Student> students;

}

