package com.kkc_lms.dto;

import com.kkc_lms.entity.ComponentType;
import lombok.Data;

import java.util.List;

@Data
public class OfferingDTO {
    private Long id;
    private String subjectCode;
    private String subjectName;
    private int credits;
    private Integer totalHours;
    private Integer capacity;
    private List<ComponentDTO> components;
}
