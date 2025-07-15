package com.kkc_lms.dto.Subject;

import lombok.Data;

import java.util.List;

@Data
public class SubjectUpdateDTO {
    private String name;
    private int credits;
    private List<Long> teacherIds;
}
