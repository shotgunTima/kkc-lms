package com.kkc_lms.dto.Student;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class StudentUpdateDTO {

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotBlank(message = "Student ID number is required")
    private String studentIdNumber;

    @NotNull(message = "Group ID is required")
    private Long groupId;

    @NotNull(message = "Direction ID is required")
    private Long directionId;

    @Positive(message = "Total credits must be positive")
    private int totalCredits;

    @Positive(message = "Admission year must be positive")
    private int admissionYear;
}
