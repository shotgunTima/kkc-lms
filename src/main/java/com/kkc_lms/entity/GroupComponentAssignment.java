package com.kkc_lms.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "group_component_assignments")
@Data
@JsonIgnoreProperties({"component"})
public class GroupComponentAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Конкретная группа
    @ManyToOne(optional = false)
    @JoinColumn(name = "group_id")
    private Group group;

    // Конкретный компонент (лекция/лаб/практика)
    @ManyToOne(optional = false)
    @JoinColumn(name = "component_id")
    private SubjectComponent component;

    // Преподаватель для этой группы на этом компоненте
    @ManyToOne(optional = false)
    @JoinColumn(name = "teacher_id")
    private Teacher teacher;
}
