
package com.kkc_lms.dto.Teacher;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class TeacherUpdateDTO {

    @NotNull
    private String academicTitle;

    @NotNull
    private Long departamentId;

    @NotNull
    private LocalDate hireDate;
}


