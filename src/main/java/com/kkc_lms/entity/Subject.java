package com.kkc_lms.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name="subjects")
public class Subject {
    @Id
    @GeneratedValue
    private Long id;
    private String name;
    @ManyToOne
    private Teacher teacher;
    private int credits;
}