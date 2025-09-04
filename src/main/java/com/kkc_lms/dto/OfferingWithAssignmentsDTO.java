package com.kkc_lms.dto;

import lombok.Data;

import java.util.List;

@Data
public class OfferingWithAssignmentsDTO {
    private Long id;
    private String subjectCode;
    private String subjectName;
    private int credits;
    private Integer totalHours;
    private Integer capacity;
    private List<ComponentAssignmentDTO> componentAssignments;
    private Long subjectId;
    private Long semesterId;
    private Long directionId;
    private String course;
    private String semesterName;
    private String directionName;


}
