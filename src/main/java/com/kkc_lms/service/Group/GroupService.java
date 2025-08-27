package com.kkc_lms.service.Group;

import com.kkc_lms.dto.Group.GroupCreateDTO;
import com.kkc_lms.dto.Group.GroupDTO;
import com.kkc_lms.dto.Student.StudentDTO;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface GroupService {
    GroupDTO saveGroup(GroupCreateDTO dto);
    Optional<GroupDTO> getGroupById(Long id);
    List<GroupDTO> getAllGroups();
    void deleteGroupById(Long id);
    List<GroupDTO> assignCuratorsToGroups(List<com.kkc_lms.dto.Group.GroupCuratorAssignDTO> assignments);
    GroupDTO assignCuratorToGroup(Long groupId, Long curatorId);
    List<GroupDTO> distributeStudentsByCourseAndDirection(Integer courseNumber, Long directionId);
    Map<String, Object> getGroupStudents(Long groupId);
    StudentDTO transferStudentToGroup(Long studentId, Long targetGroupId, boolean force);
    GroupDTO updateGroup(Long id, GroupCreateDTO dto);
    List<GroupDTO> searchGroups(String search, String directionName);
}

