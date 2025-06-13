package com.kkc_lms.service.Group;

import com.kkc_lms.dto.Group.GroupCreateDTO;
import com.kkc_lms.dto.Group.GroupDTO;

import java.util.List;
import java.util.Optional;

public interface GroupService {
    GroupDTO saveGroup(GroupCreateDTO dto);
    Optional<GroupDTO> getGroupById(Long id);
    List<GroupDTO> getAllGroups();
    void deleteGroupById(Long id);
}
