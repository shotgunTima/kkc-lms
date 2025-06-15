package com.kkc_lms.dto.Group;

import lombok.Data;

@Data
public class GroupDTO {

    private Long id;
    private String name;
    private Long directionId;
    private String directionName;
    private Long departmentId;
    private String departmentName;
    private Long curatorId;
    private String curatorFullName;
}
