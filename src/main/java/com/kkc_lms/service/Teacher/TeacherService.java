package com.kkc_lms.service.Teacher;

import com.kkc_lms.dto.Teacher.TeacherCreateDTO;
import com.kkc_lms.dto.Teacher.TeacherOutputDTO;
import com.kkc_lms.dto.Teacher.TeacherUpdateDTO;

import java.util.List;

public interface TeacherService {
    TeacherOutputDTO create(TeacherCreateDTO dto);
    List<TeacherOutputDTO> getAll();
    TeacherOutputDTO getById(Long id);
    void delete(Long id);
    void createForUser(com.kkc_lms.entity.User user);
    TeacherOutputDTO update(Long id, TeacherUpdateDTO dto);

}
