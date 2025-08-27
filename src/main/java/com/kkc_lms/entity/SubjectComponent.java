package com.kkc_lms.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "subject_components")
@Data
public class SubjectComponent {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "offering_id")
    @JsonIgnoreProperties("components")
    private SubjectOffering offering;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ComponentType type;

    @Column(nullable = false)
    private int hours;

    /**
     * Список назначений преподавателей для конкретной группы на этот компонент.
     * Связывается с сущностью GroupComponentAssignment.component
     */
    @OneToMany(mappedBy = "component", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonIgnoreProperties("component")
    private List<GroupComponentAssignment> assignments = new ArrayList<>();

    // Можно добавить: room, weekday, startTime, duration и т.д.
}
