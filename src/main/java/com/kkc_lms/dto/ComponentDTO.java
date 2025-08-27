package com.kkc_lms.dto;

import com.kkc_lms.entity.ComponentType;
import lombok.Data;

@Data
public class ComponentDTO {
    private Long id;
    private ComponentType type;
    private int hours;
    private Long teacherId;
    private String teacherName;
}
