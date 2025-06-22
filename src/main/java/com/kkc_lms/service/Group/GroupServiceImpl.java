package com.kkc_lms.service.Group;

import com.kkc_lms.dto.Group.GroupCreateDTO;
import com.kkc_lms.dto.Group.GroupDTO;
import com.kkc_lms.entity.Direction;
import com.kkc_lms.entity.Group;
import com.kkc_lms.entity.Teacher;
import com.kkc_lms.repository.DirectionRepository;
import com.kkc_lms.repository.GroupRepository;
import com.kkc_lms.repository.TeacherRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GroupServiceImpl implements GroupService {

    private final GroupRepository groupRepository;
    private final TeacherRepository teacherRepository;
    private final DirectionRepository directionRepository;

    @Override
    public GroupDTO saveGroup(GroupCreateDTO dto) {
        Direction direction = directionRepository.findById(dto.getDirectionId())
                .orElseThrow(() -> new EntityNotFoundException("Направление не найдено"));
        Teacher curator = teacherRepository.findById(dto.getCuratorId())
                .orElseThrow(() -> new EntityNotFoundException("Куратор (преподаватель) не найден"));

        if (curator.getDepartment() == null ||
                !curator.getDepartment().getId().equals(direction.getDepartment().getId())) {
            throw new IllegalArgumentException("Куратор должен работать на той же кафедре, что и направление");
        }

        Group group = new Group();
        group.setName(dto.getName());
        group.setDirection(direction);
        group.setCurator(curator);

        Group saved = groupRepository.save(group);
        return mapToDTO(saved);
    }



    @Override
    public Optional<GroupDTO> getGroupById(Long id) {
        return groupRepository.findById(id).map(this::mapToDTO);
    }

    @Override
    public List<GroupDTO> getAllGroups() {
        return groupRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteGroupById(Long id) {
        if (!groupRepository.existsById(id)) {
            throw new EntityNotFoundException("Группа не найдена");
        }
        groupRepository.deleteById(id);
    }

    private GroupDTO mapToDTO(Group group) {
        GroupDTO dto = new GroupDTO();
        dto.setId(group.getId());
        dto.setName(group.getName());

        Direction dir = group.getDirection();
        dto.setDirectionId(dir.getId());
        dto.setDirectionName(dir.getName());
        if (dir.getDepartment() != null) {
            dto.setDepartmentId(dir.getDepartment().getId());
            dto.setDepartmentName(dir.getDepartment().getName());
        }

        Teacher curator = group.getCurator();
        dto.setCuratorId(curator.getId());
        dto.setCuratorFullName(curator.getUser().getFullname());
        return dto;
    }
}
