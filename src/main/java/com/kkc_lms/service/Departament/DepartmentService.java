package com.kkc_lms.service.Departament;

import com.kkc_lms.dto.Departament.DepartmentDTO;
import com.kkc_lms.entity.Department;
import com.kkc_lms.entity.Teacher;
import com.kkc_lms.repository.DepartmentRepository;
import com.kkc_lms.repository.TeacherRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final TeacherRepository teacherRepository;

    public DepartmentDTO createDepartment(DepartmentDTO dto) {
        Department department = new Department();
        department.setName(dto.getName());

        if (dto.getHeadId() != null) {
            Optional<Teacher> head = teacherRepository.findById(dto.getHeadId());
            head.ifPresent(department::setHead);
        }

        if (dto.getTeacherIds() != null) {
            List<Teacher> teachers = teacherRepository.findAllById(dto.getTeacherIds());
            for (Teacher teacher : teachers) {
                teacher.setDepartment(department);
            }
            department.setTeachers(teachers);
        }

        Department saved = departmentRepository.save(department);
        return mapToDTO(saved);
    }

    public List<DepartmentDTO> getAllDepartments() {
        return departmentRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public DepartmentDTO getDepartmentById(Long id) {
        return departmentRepository.findById(id)
                .map(this::mapToDTO)
                .orElse(null);
    }

    public void deleteDepartment(Long id) {
        departmentRepository.deleteById(id);
    }

    private DepartmentDTO mapToDTO(Department department) {
        DepartmentDTO dto = new DepartmentDTO();
        dto.setId(department.getId());
        dto.setName(department.getName());

        if (department.getHead() != null)
            dto.setHeadId(department.getHead().getId());

        if (department.getTeachers() != null) {
            dto.setTeacherIds(
                    department.getTeachers().stream()
                            .map(Teacher::getId)
                            .collect(Collectors.toList())
            );
        }

        return dto;
    }
}
