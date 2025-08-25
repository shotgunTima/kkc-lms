package com.kkc_lms.entity;
import lombok.Getter;

@Getter
public enum StudentStatus {
    ACTIVE("student_status.active"),
    EXPELLED("student_status.expelled"),
    ACADEMIC_LEAVE("student_status.academic_leave"),
    SUSPENDED("student_status.suspended"),
    GRADUATED("student_status.graduated");

    private final String label;

    StudentStatus(String label) {
        this.label = label;
    }
}