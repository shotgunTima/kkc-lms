package com.kkc_lms.entity;

import lombok.Getter;

@Getter
public enum TeacherStatus {
    ACTIVE("teacher_status.active"),
    ON_LEAVE("teacher_status.on_leave"),
    RETIRED("teacher_status.retired"),
    FIRED("teacher_status.fired");
    private final String label;

    TeacherStatus(String label) {
        this.label = label;
    }
}
