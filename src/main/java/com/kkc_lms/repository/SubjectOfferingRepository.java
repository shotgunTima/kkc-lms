package com.kkc_lms.repository;

import com.kkc_lms.entity.Direction;
import com.kkc_lms.entity.Semester;
import com.kkc_lms.entity.SubjectOffering;
import com.kkc_lms.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SubjectOfferingRepository extends JpaRepository<SubjectOffering, Long> {
    List<SubjectOffering> findBySemesterIdAndDirectionIdAndCourse(Long semesterId, Long directionId, Course course);
    List<SubjectOffering> findBySemester(Semester semester);
    List<SubjectOffering> findBySemesterAndDirectionAndCourse(Semester semester, Direction direction, Course course);

    // Подгружаем components и subject, чтобы избежать LazyInitializationException
    @Query("""
      select distinct so
      from SubjectOffering so
      left join fetch so.components c
      left join fetch so.subject subj
      where so.semester.id = :semesterId
        and so.direction.id = :directionId
        and so.course = :course
      """)
    List<SubjectOffering> findBySemesterIdAndDirectionIdAndCourseWithComponents(
            @Param("semesterId") Long semesterId,
            @Param("directionId") Long directionId,
            @Param("course") Course course
    );

    // По году (опционально)
    @Query("""
      select distinct so
      from SubjectOffering so
      left join fetch so.components c
      where so.direction.id = :directionId
        and so.course = :course
        and so.semester.year = :year
      """)
    List<SubjectOffering> findByDirectionIdAndCourseAndSemester_YearWithComponents(
            @Param("directionId") Long directionId,
            @Param("course") Course course,
            @Param("year") int year
    );
}
