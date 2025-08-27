package com.kkc_lms.entity;

import lombok.Getter;

@Getter
public enum Course {
    FIRST(1, "course.1"),
    SECOND(2, "course.2"),
    THIRD(3, "course.3"),
    FOURTH(4, "course.4");

    private final int number;
    private final String label;

    Course(int number, String label) {
        this.number = number;
        this.label = label;
    }

    public static Course fromNumber(Integer number) {
        if (number == null) return null;
        for (Course c : values()) {
            if (c.number == number) return c;
        }
        throw new IllegalArgumentException("Invalid course number: " + number + ". Expected 1..4");
    }

    public static Course fromFlexible(String input) {
        if (input == null) throw new IllegalArgumentException("Course cannot be null");

        // Если число
        try {
            return fromNumber(Integer.parseInt(input));
        } catch (NumberFormatException ignored) {}

        // Если название (FIRST, SECOND, …)
        return Course.valueOf(input.toUpperCase());
    }
}
