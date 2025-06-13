package com.kkc_lms.service.Teacher;

import com.kkc_lms.dto.Teacher.TeacherCreateDTO;
import com.kkc_lms.dto.Teacher.TeacherDTO;
import com.kkc_lms.dto.Teacher.TeacherUpdateDTO;

import java.util.List;
import java.util.Optional;

public interface TeacherService {
    TeacherDTO saveTeacher(TeacherCreateDTO dto);
    Optional<TeacherDTO> getTeacherById(Long id);
    List<TeacherDTO> getAllTeachers();
    void deleteTeacherById(Long id);
    Optional<TeacherDTO> updateTeacher(Long id, TeacherUpdateDTO dto);
}
