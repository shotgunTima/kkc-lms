package com.kkc_lms.repository;

import com.kkc_lms.entity.News;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface NewsRepository extends JpaRepository<News, Long> {
    @Query("""
      select n from News n
      where n.targetType = com.kkc_lms.entity.TargetType.ALL
        or (n.targetType = com.kkc_lms.entity.TargetType.DIRECTION and (:dirId is not null and n.direction.id = :dirId))
        or (n.targetType = com.kkc_lms.entity.TargetType.GROUP and (:groupId is not null and n.group.id = :groupId))
      order by n.createdAt desc
      """)
    List<News> findForStudentNullable(@Param("dirId") Long dirId, @Param("groupId") Long groupId);
}

