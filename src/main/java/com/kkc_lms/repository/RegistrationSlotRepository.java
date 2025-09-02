package com.kkc_lms.repository;

import com.kkc_lms.entity.RegistrationSession;
import com.kkc_lms.entity.RegistrationSlot;
import com.kkc_lms.entity.SubjectOffering;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface RegistrationSlotRepository extends JpaRepository<RegistrationSlot, Long> {


    Optional<RegistrationSlot> findBySessionAndOffering(RegistrationSession session, SubjectOffering offering);
    List<RegistrationSlot> findBySession(RegistrationSession session);

    @Query("""
        select sl from RegistrationSlot sl
        left join fetch sl.offering off
        left join fetch off.subject subj
        where sl.id = :id
    """)
    Optional<RegistrationSlot> findWithOfferingAndSubjectById(@Param("id") Long id);

    List<RegistrationSlot> findBySessionIn(List<RegistrationSession> sessions);
}
