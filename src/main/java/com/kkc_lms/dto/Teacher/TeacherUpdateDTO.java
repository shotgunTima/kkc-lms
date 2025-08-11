package com.kkc_lms.dto.Teacher;

import com.kkc_lms.entity.AcademicTitles;
import com.kkc_lms.entity.TeacherStatus;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;

@Data
public class TeacherUpdateDTO {
    private String username;
    private String password;
    private String email;
    private String fullname;
    private String phonenum;
    private String address;
    private AcademicTitles academicTitle;
    private LocalDate hireDate;
    private TeacherStatus teacherStatus;
    private MultipartFile profileImage;
}
