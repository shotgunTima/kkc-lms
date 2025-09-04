package com.kkc_lms.dto;

import com.kkc_lms.dto.ComponentDTO;
import lombok.Data;

import java.util.List;

@Data
public class OfferingDTO {
    private Long id;

    private Long subjectId;
    private String subjectCode;
    private String subjectName;

    private Long semesterId;
    private String semesterName;
    private Long teacherId;
    private String teacherName;

    private Long directionId;
    private String directionName;

    private String course;

    private int credits;
    private Integer totalHours;
    private Integer capacity;

    private List<ComponentDTO> components;
}
