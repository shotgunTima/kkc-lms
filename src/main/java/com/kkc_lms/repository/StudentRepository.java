package com.kkc_lms.repository;

import com.kkc_lms.entity.*;
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
    List<Student> findAll();
    List<Student> findAllByDirection(Direction direction);
    List<Student> findAllByDirectionAndGroup(Direction direction, Group group);
    List<Student> findByGroup_Id(Long groupId);

}
