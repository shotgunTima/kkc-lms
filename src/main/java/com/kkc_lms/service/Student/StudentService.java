package com.kkc_lms.service.Student;


import com.kkc_lms.dto.Student.StudentCreateDTO;
import com.kkc_lms.dto.Student.StudentDTO;
import com.kkc_lms.entity.Student;
import com.kkc_lms.entity.User;

import java.util.List;
import java.util.Optional;

public interface StudentService {
    StudentDTO createForUser(User user, Long directionId, Integer courseNumber);
    StudentDTO saveStudent(StudentCreateDTO dto);
    Optional<StudentDTO> getStudentById(Long id);
    Optional<StudentDTO> getByStudentIdNumber(String studentIdNumber);
    List<StudentDTO> getAllStudents();
    List<Student> getStudentsByCourseAndDirection(Integer courseNumber, Long directionId);
    void deleteStudentById(Long id);
}
