package com.kkc_lms.service.Student;


import com.kkc_lms.dto.Student.StudentCreateDTO;
import com.kkc_lms.dto.Student.StudentDTO;

import java.util.List;
import java.util.Optional;

public interface StudentService {
    StudentDTO saveStudent(StudentCreateDTO dto);
    Optional<StudentDTO> getStudentById(Long id);
    Optional<StudentDTO> getByStudentIdNumber(String studentIdNumber);
    List<StudentDTO> getAllStudents();
    void deleteStudentById(Long id);
}
