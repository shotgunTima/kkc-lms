package com.kkc_lms.dto.Subject;

import lombok.Data;

import java.util.List;

@Data
public class SubjectDTO {
    private Long id;
    private String name;
    private int credits;
    private String code;
    private String description;
    private List<Long> teacherIds;
    private List<String> teacherNames;
}
