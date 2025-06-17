package com.kkc_lms.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name="studyPlans")
public class StudyPlan {
    @Id
    @GeneratedValue
    private Long id;
    private String programName;
    @ManyToOne
    private Semester semester;
    @ManyToOne
    private Department department;
    private int totalCredits;
}
