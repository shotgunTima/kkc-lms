package com.kkc_lms.dto.Student;

import com.kkc_lms.entity.Course;
import com.kkc_lms.entity.StudentStatus;
import lombok.Data;

@Data
public class StudentDTO {
    private Long id;

    // данные из User
    private Long userId;
    private String username;
    private String fullname;
    private String email;
    private String phonenum;

    // данные студента
    private String studentIdNumber;
    private Long groupId;
    private String groupName;
    private Long directionId;
    private String directionName;
    private int totalCredits;
    private int admissionYear;
    private boolean contractPaid;
    private StudentStatus status;
    private Course course;
}
