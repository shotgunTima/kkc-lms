package com.kkc_lms.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name="subjectInStudyPlans")
public class SubjectInStudPlan {
    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne
    private StudyPlan studyPlan;

    @ManyToOne
    private Subject subject;

    @ManyToOne
    private Group group;

    @ManyToOne
    private Semester semester;

    private int credits;
    private boolean isOptional;
}

