package com.kkc_lms.dto.Teacher;

import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class TeacherOutputDTO {
    private Long id;
    private String fullName;
    private String academicTitle;
    private LocalDate hireDate;
    private String status;
    private List<String> subjects;
}
