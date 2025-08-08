package com.kkc_lms.entity;

import lombok.Getter;

@Getter
public enum Role {
    STUDENT("role.student"),
    TEACHER("role.teacher"),
    ADMIN("role.admin"),
    METHODIST("role.methodist"),
    ACCOUNTANT("role.accountant");

    private final String label;

    Role(String label) {
        this.label = label;
    }
}
