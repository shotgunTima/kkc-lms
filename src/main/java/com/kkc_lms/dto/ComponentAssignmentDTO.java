package com.kkc_lms.dto;

import com.kkc_lms.entity.ComponentType;
import lombok.Data;

@Data
public class ComponentAssignmentDTO {
    private Long componentId;
    private ComponentType type;
    private int hours;
    private Long teacherId;
    private String teacherName;
    private Long groupId;
    private String groupName;
}
