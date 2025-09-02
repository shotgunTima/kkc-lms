package com.kkc_lms.repository;

import com.kkc_lms.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface StudentSubjectRegistrationRepository extends JpaRepository<StudentSubjectRegistration, Long> {
    Optional<StudentSubjectRegistration> findByStudent_IdAndSlot_Id(Long studentId, Long slotId);
    List<StudentSubjectRegistration> findBySlot_SessionIdAndStudent_Id(Long sessionId, Long studentId);
    List<StudentSubjectRegistration> findBySlot_SessionId(Long sessionId);

    @Query("""
        select r from StudentSubjectRegistration r
        left join fetch r.slot sl
        left join fetch sl.offering off
        left join fetch r.student st
        left join fetch st.user u
        where r.id = :id
    """)
    Optional<StudentSubjectRegistration> findByIdWithSlotAndStudent(@Param("id") Long id);

    Optional<StudentSubjectRegistration> findByStudentAndSlot(Student student, RegistrationSlot slot);

    long countBySlotAndActiveTrue(RegistrationSlot slot);

    List<StudentSubjectRegistration> findByStudent_IdAndSlot_SessionIn(Long studentId, List<RegistrationSession> sessions);
}
