package com.kkc_lms.dto;

import lombok.Data;

import java.util.List;

@Data
public class CreateOfferingDTO {
    private Long subjectId;
    private Long semesterId;
    private Long directionId;
    private String course;
    private Long moduleId;
    private Integer totalHours;
    private Integer capacity;
    private List<ComponentDTO> components;

}


