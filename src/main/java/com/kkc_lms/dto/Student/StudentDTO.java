package com.kkc_lms.dto.Student;

import com.kkc_lms.entity.Course;
import lombok.Data;

@Data
public class StudentDTO {
    private Long id;
    private Long userId;
    private String username;
    private String studentIdNumber;
    private Long groupId;
    private Long directionId;
    private String directionName;
    private String groupName;
    private int totalCredits;
    private int admissionYear;
    private Course course;
}
