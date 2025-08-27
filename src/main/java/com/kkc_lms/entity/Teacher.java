package com.kkc_lms.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Data
@Table(name = "teachers")
public class Teacher {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(
            name = "user_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_teacher_user", foreignKeyDefinition = "FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE")
    )
    @EqualsAndHashCode.Exclude
    @JsonManagedReference
    private User user;

    @Enumerated(EnumType.STRING)
    private AcademicTitles academicTitle;

    @Column(name = "hire_date", nullable = false)
    private LocalDate hireDate;

    @Enumerated(EnumType.STRING)
    private TeacherStatus teacherStatus;

    @ManyToMany(mappedBy = "teachers")
    @EqualsAndHashCode.Exclude
    @JsonIgnoreProperties("teachers")
    private Set<Subject> subjects = new HashSet<>();
}
