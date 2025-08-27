package com.kkc_lms.dto.User;

import com.kkc_lms.entity.*;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;

@Data
public class UserUpdateDTO {

        @NotBlank(message = "Не должен быть пустым")
        private String username;

        @Email(message = "Некорректный email")
        @NotBlank(message = "Email не должен быть пустым")
        private String email;

        @NotBlank(message = "Не должен быть пустым")
        private String fullname;

        @NotNull(message = "Роль должна быть указана")
        private Role role;

        @Pattern(
                regexp = "\\+996\\d{9}",
                message = "Телефон должен быть в формате +996XXXXXXXXX"
        )
        private String phonenum;


        @NotBlank
        private String address;

        private String profileImage;

        private Long directionId;
        private AcademicTitles academicTitle;
        private TeacherStatus teacherStatus;
        private LocalDate hireDate;

        private String studentIdNumber;
        private Long groupId;
        private int totalCredits;
        private int admissionYear;
        private boolean contractPaid;
        private StudentStatus status;
        private Course course;

}
