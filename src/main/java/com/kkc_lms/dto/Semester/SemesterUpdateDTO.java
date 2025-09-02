package com.kkc_lms.dto.Semester;

import com.kkc_lms.entity.SemesterTerm;
import lombok.Data;

import java.time.LocalDate;

@Data
public class SemesterUpdateDTO {
    private SemesterTerm term;
    private String name;
    private int year;
    private LocalDate startDate;
    private LocalDate endDate;
}
