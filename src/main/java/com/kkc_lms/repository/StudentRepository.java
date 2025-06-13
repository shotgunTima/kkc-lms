package com.kkc_lms.repository;

import com.kkc_lms.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByStudentIdNumber(String studentIdNumber);
}
