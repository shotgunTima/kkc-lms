package com.kkc_lms.service.Group;

import com.kkc_lms.dto.Group.GroupCreateDTO;
import com.kkc_lms.dto.Group.GroupDTO;
import com.kkc_lms.entity.Department;
import com.kkc_lms.repository.DepartmentRepository;
import com.kkc_lms.entity.Group;
import com.kkc_lms.entity.Teacher;
import com.kkc_lms.repository.GroupRepository;
import com.kkc_lms.repository.TeacherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class GroupServiceImpl implements GroupService {

    private final GroupRepository groupRepository;
    private final DepartmentRepository departmentRepository;
    private final TeacherRepository teacherRepository;

    @Autowired
    public GroupServiceImpl(GroupRepository groupRepository,
                            TeacherRepository teacherRepository,
                            DepartmentRepository departmentRepository) {
        this.groupRepository = groupRepository;
        this.teacherRepository = teacherRepository;
        this.departmentRepository = departmentRepository;
    }


    @Override
    public GroupDTO saveGroup(GroupCreateDTO dto) {
        Department department = departmentRepository.findById(dto.getDepartmentId())
                .orElseThrow(() -> new IllegalArgumentException("Department not found"));
        Teacher curator = teacherRepository.findById(dto.getCuratorId())
                .orElseThrow(() -> new IllegalArgumentException("Curator (teacher) not found"));

        Group group = new Group();
        group.setName(dto.getName());
        group.setDepartment(department);
        group.setCurator(curator);

        return mapToDTO(groupRepository.save(group));
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
        groupRepository.deleteById(id);
    }

    private GroupDTO mapToDTO(Group group) {
        GroupDTO dto = new GroupDTO();
        dto.setId(group.getId());
        dto.setName(group.getName());
        dto.setDepartmentId(group.getDepartment().getId());
        dto.setDepartmentName(group.getDepartment().getName());
        dto.setCuratorId(group.getCurator().getId());
        dto.setCuratorFullName(group.getCurator().getUser().getFullname()); // Предполагается метод getFullName()
        return dto;
    }
}
