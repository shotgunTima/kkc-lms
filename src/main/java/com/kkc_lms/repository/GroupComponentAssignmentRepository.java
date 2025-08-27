package com.kkc_lms.repository;

import com.kkc_lms.entity.GroupComponentAssignment;
import com.kkc_lms.entity.SubjectOffering;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface GroupComponentAssignmentRepository extends JpaRepository<GroupComponentAssignment, Long> {

    // Надёжный вариант: явно ищем по offering через join
    @Query("select gca from GroupComponentAssignment gca where gca.component.offering = :offering")
    List<GroupComponentAssignment> findByOffering(@Param("offering") SubjectOffering offering);

    // Можно оставить и findByComponent_Offering(...) если всё работает в твоей конфигурации.
}
