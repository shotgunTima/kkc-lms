package com.kkc_lms.repository;

import com.kkc_lms.entity.Semester;
import com.kkc_lms.entity.SubjectOffering;
import com.kkc_lms.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SubjectOfferingRepository extends JpaRepository<SubjectOffering, Long> {
    List<SubjectOffering> findBySemesterIdAndDirectionIdAndCourse(Long semesterId, Long directionId, Course course);
    List<SubjectOffering> findBySemester(Semester semester);
}
