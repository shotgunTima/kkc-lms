package com.kkc_lms.entity;

import lombok.Getter;

@Getter
public enum AcademicTitles {

    SENIOR("academic_titles.senior"),
    TEACHER("academic_titles.teacher"),
    GRADUATE_STUDENT("academic_titles.graduate_student"),
    TRAINEE("academic_titles.trainee");
    private final String label;

    AcademicTitles(String label) {
        this.label = label;
    }
}
