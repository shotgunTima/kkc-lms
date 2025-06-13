package com.kkc_lms.dto.Teacher;

import lombok.Data;

import java.time.LocalDate;

@Data
public class TeacherCreateDTO {
    private Long userId;
    private String academicTitle;
    private Long departamentId;
    private LocalDate hireDate;
}

