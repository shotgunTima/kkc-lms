package com.kkc_lms.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Entity
@Data
@Table(name = "departments")
public class Department {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    // Один руководитель, один преподаватель
    @OneToOne
    @JoinColumn(name = "head_id") // внешний ключ на таблицу teachers
    private Teacher head;

    // Один отдел может содержать много преподавателей
    @OneToMany(mappedBy = "department")
    private List<Teacher> teachers;
}
