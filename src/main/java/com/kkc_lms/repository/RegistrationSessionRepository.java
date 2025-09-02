package com.kkc_lms.repository;

import com.kkc_lms.entity.Course;
import com.kkc_lms.entity.Direction;
import com.kkc_lms.entity.RegistrationSession;
import com.kkc_lms.entity.Semester;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface RegistrationSessionRepository extends JpaRepository<RegistrationSession, Long> {
    Optional<RegistrationSession> findBySemesterAndDirectionAndCourseAndYear(Semester semester, Direction direction, Course course, Integer year);

    List<RegistrationSession> findBySemesterAndDirectionAndCourse(Semester semester, Direction direction, Course course);
    Optional<RegistrationSession> findBySemesterAndDirectionAndCourseAndYear(Semester sem, Direction dir, Course course, int year);

    @Query("""
        select s from RegistrationSession s
        left join fetch s.slots sl
        left join fetch sl.offering off
        left join fetch off.subject subj
        where s.id = :id
    """)
    Optional<RegistrationSession> findWithSlotsAndOfferingsById(@Param("id") Long id);

    @Query("""
        select s from RegistrationSession s
        left join fetch s.slots sl
        where s.id in :ids
    """)
    List<RegistrationSession> findWithSlotsByIds(@Param("ids") List<Long> ids);
}
