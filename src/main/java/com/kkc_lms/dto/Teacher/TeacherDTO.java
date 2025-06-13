package com.kkc_lms.dto.Teacher;
import lombok.Data;

import java.time.LocalDate;

@Data
public class TeacherDTO {
    private Long id;
    private Long userId;
    private String academicTitle;
    private Long departamentId;
    private LocalDate hireDate;
}


