package com.kkc_lms.dto.Teacher;

import com.kkc_lms.entity.AcademicTitles;
import com.kkc_lms.entity.TeacherStatus;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class TeacherDTO {
    private Long id;
    private Long userId;
    private String username;
    private String email;
    private String fullname;
    private String phonenum;
    private AcademicTitles academicTitle;
    private LocalDate hireDate;
    private TeacherStatus teacherStatus;
    private List<String> subjectNames;
}
