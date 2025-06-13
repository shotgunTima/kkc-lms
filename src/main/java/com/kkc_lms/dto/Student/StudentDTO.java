package com.kkc_lms.dto.Student;

import lombok.Data;

@Data
public class StudentDTO {
    private Long id;
    private Long userId;
    private String username;
    private String studentIdNumber;
    private Long groupId;
    private String groupName;
    private int totalCredits;
    private int admissionYear;
}
