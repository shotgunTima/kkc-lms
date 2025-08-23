package com.kkc_lms.dto.Group;

import com.kkc_lms.dto.Student.StudentDTO;
import lombok.Data;

import java.util.List;

@Data
public class GroupDTO {

    private Long id;
    private String name;
    private Long directionId;
    private String directionName;
    private Long curatorId;
    private String curatorFullName;
    private List<StudentDTO> students;
    private Integer studentCount;
}
