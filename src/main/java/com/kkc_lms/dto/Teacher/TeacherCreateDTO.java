package com.kkc_lms.dto.Teacher;

import com.kkc_lms.entity.AcademicTitles;
import com.kkc_lms.entity.TeacherStatus;
import lombok.Data;

import java.time.LocalDate;

@Data
public class TeacherCreateDTO {
    private String username;
    private String password;
    private String email;
    private String fullname;
    private String phonenum;
    private String address;
    private AcademicTitles academicTitle;
    private LocalDate hireDate;
    private TeacherStatus teacherStatus;
    private String profileImage;
}
