package com.kkc_lms.repository;

import com.kkc_lms.entity.News;
import org.springframework.data.jpa.repository.JpaRepository;
public interface NewsRepository extends JpaRepository<News, Long> {

    }
