package com.kkc_lms.service.Teacher;

import com.kkc_lms.dto.Teacher.TeacherCreateDTO;
import com.kkc_lms.dto.Teacher.TeacherDTO;
import com.kkc_lms.dto.Teacher.TeacherUpdateDTO;
import com.kkc_lms.entity.AcademicTitles;
import com.kkc_lms.entity.TeacherStatus;
import com.kkc_lms.entity.User;

import java.time.LocalDate;
import java.util.List;

public interface TeacherService {
    TeacherDTO createTeacher(TeacherCreateDTO dto);

    TeacherDTO updateTeacher(Long id, TeacherUpdateDTO dto);

    void deleteTeacher(Long id);

    TeacherDTO getTeacherById(Long id);

    List<TeacherDTO> getAllTeachers();

    void deleteByUserId(Long userId);

    // Добавленные методы для работы с деталями преподавателя:
    void createForUserWithDetails(User user, AcademicTitles academicTitle, TeacherStatus teacherStatus, LocalDate hireDate);

    void updateTeacherDetails(Long userId, AcademicTitles academicTitle, TeacherStatus teacherStatus, LocalDate hireDate);
}
