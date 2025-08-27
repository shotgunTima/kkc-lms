package com.kkc_lms.repository;

import com.kkc_lms.entity.Course;
import com.kkc_lms.entity.Direction;
import com.kkc_lms.entity.Group;
import com.kkc_lms.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByStudentIdNumber(String studentIdNumber);
    boolean existsByStudentIdNumber(String candidate);
    List<Student> findByCourseAndDirection(Course course, Direction direction);
    void deleteByUserId(Long userId);
    List<Student> findByGroup(Group group);
    long countByGroupId(Long groupId);
    Optional<Student> findByUserId(Long userId);
}
