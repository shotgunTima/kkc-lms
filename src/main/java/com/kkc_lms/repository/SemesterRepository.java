package com.kkc_lms.repository;

import com.kkc_lms.entity.Semester;
import com.kkc_lms.entity.SemesterTerm;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SemesterRepository extends JpaRepository<Semester, Long> {
    boolean existsByTermAndYear(SemesterTerm term, int year);

}
