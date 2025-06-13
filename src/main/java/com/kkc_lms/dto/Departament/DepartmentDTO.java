package com.kkc_lms.dto.Departament;

import lombok.Data;

import java.util.List;

@Data
public class DepartmentDTO {
    private Long id;
    private String name;
    private Long headId;
    private List<Long> teacherIds;
}
