package com.kkc_lms.dto.Subject;

import com.kkc_lms.dto.Teacher.TeacherOutputDTO;
import lombok.Data;

import java.util.List;

@Data
public class SubjectOutputDTO {
    private Long id;
    private String name;
    private int credits;
    private String description;
    private List<TeacherOutputDTO> teachers;
}

