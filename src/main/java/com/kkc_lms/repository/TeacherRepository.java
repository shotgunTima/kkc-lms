package com.kkc_lms.repository;

import com.kkc_lms.entity.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

public interface TeacherRepository extends JpaRepository<Teacher, Long> {
    Optional<Teacher> findByUserId(Long userId);

    @Modifying
    @Transactional
    @Query("delete from Teacher t where t.user.id = :userId")
    void deleteByUserId(@Param("userId") Long userId);
}
