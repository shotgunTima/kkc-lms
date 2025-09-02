package com.kkc_lms.repository;

import com.kkc_lms.entity.NewsRecipient;
import com.kkc_lms.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NewsRecipientRepository extends JpaRepository<NewsRecipient, Long> {
    List<NewsRecipient> findAllByStudent(Student student);
}
