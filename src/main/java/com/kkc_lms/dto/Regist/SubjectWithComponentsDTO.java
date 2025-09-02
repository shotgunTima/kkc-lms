package com.kkc_lms.dto.Regist;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubjectWithComponentsDTO {
    private Long subjectId;
    private String code;
    private String name;
    private int credits;
    private List<ComponentSimpleDTO> components = new ArrayList<>();
    private List<TeacherSimpleDTO> teachers = new ArrayList<>();
}