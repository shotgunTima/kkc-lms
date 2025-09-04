package com.kkc_lms.repository;

import com.kkc_lms.entity.Group;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GroupRepository extends JpaRepository<Group, Long> {
    List<Group> findByDirection_Name(String name);
    List<Group> findByCurator_User_FullnameContainingIgnoreCase(String fullname);

    List<Group> findAllByDirectionId(Long directionId);
}
