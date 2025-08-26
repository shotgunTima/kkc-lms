package com.kkc_lms.dto.Student;

import com.kkc_lms.entity.Course;
import com.kkc_lms.entity.StudentStatus;
import lombok.Data;

@Data
public class StudentCreateDTO {
    private String username;
    private String password;
    private String fullname;
    private String email;
    private String phonenum;

    private String studentIdNumber;
    private Long groupId;
    private Long directionId;
    private int totalCredits;
    private int admissionYear;
    private boolean contractPaid;
    private StudentStatus status;
    private Course course;
}
