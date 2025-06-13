package com.kkc_lms.entity;

public enum Role {
    STUDENT("Студент"),
    TEACHER("Учитель"),
    ADMIN("Администратор"),
    METHODIST("Методист"),
    ACCOUNTANT("Бухгалтер");

    private final String label;

    Role(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}

