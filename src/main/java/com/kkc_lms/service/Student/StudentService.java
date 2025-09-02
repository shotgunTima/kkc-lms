package com.kkc_lms.service.Student;


import com.kkc_lms.dto.News.NewsDTO;
import com.kkc_lms.dto.Student.StudentCreateDTO;
import com.kkc_lms.dto.Student.StudentDTO;
import com.kkc_lms.entity.Course;
import com.kkc_lms.entity.Student;
import com.kkc_lms.entity.StudentStatus;
import com.kkc_lms.entity.User;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.Optional;

public interface StudentService {
    StudentDTO createForUser(User user, Long groupId, Long directionId, int admissionYear,
                             Course course, boolean contractPaid, StudentStatus status, int totalCredits,
                             String studentIdNumber);

    StudentDTO updateStudent(Long id, StudentCreateDTO dto);
    StudentDTO saveStudent(StudentCreateDTO dto);

    @Transactional
    StudentDTO updateStudentDetails(Long userId,
                                    Long groupId,
                                    Long directionId,
                                    int admissionYear,
                                    Course course,
                                    boolean contractPaid,
                                    StudentStatus status,
                                    int totalCredits,
                                    String studentIdNumber);

    Optional<StudentDTO> getStudentById(Long id);
    Optional<StudentDTO> getByStudentIdNumber(String studentIdNumber);
    List<StudentDTO> getAllStudents();
    List<Student> getStudentsByCourseAndDirection(Integer courseNumber, Long directionId);
    void deleteStudentById(Long id);
    List<NewsDTO> getNewsForStudent(Long studentId);
}
