package com.kkc_lms.service.Semester;

import com.kkc_lms.dto.Semester.SemesterCreateDTO;
import com.kkc_lms.dto.Semester.SemesterDTO;
import com.kkc_lms.dto.Semester.SemesterUpdateDTO;

import java.util.List;

public interface SemesterService {
    SemesterDTO createSemester(SemesterCreateDTO dto);
    SemesterDTO updateSemester(Long id, SemesterUpdateDTO dto);
    void deleteSemester(Long id);
    SemesterDTO getSemesterById(Long id);
    List<SemesterDTO> getAllSemesters();
}
