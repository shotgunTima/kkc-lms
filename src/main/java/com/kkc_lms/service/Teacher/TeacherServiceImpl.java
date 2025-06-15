package com.kkc_lms.service.Teacher;

import com.kkc_lms.dto.Teacher.TeacherCreateDTO;
import com.kkc_lms.dto.Teacher.TeacherDTO;
import com.kkc_lms.dto.Teacher.TeacherUpdateDTO;
import com.kkc_lms.entity.Department;
import com.kkc_lms.entity.Teacher;
import com.kkc_lms.entity.User;
import com.kkc_lms.repository.DepartmentRepository;
import com.kkc_lms.repository.TeacherRepository;
import com.kkc_lms.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TeacherServiceImpl implements TeacherService {

    private final TeacherRepository teacherRepository;
    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;

    @Autowired
    public TeacherServiceImpl(
            TeacherRepository teacherRepository,
            UserRepository userRepository,
            DepartmentRepository departmentRepository
    ) {
        this.teacherRepository = teacherRepository;
        this.userRepository = userRepository;
        this.departmentRepository = departmentRepository;
    }
    @Transactional
    public Teacher createForUser(User user) {
        Teacher t = new Teacher();
        t.setUser(user);
        t.setHireDate(LocalDate.now());
        return teacherRepository.save(t);
    }


    @Override
    public TeacherDTO saveTeacher(TeacherCreateDTO dto) {
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Department departament = departmentRepository.findById(dto.getDepartamentId())
                .orElseThrow(() -> new RuntimeException("Departament not found"));

        Teacher teacher = new Teacher();
        teacher.setUser(user);
        teacher.setAcademicTitle(dto.getAcademicTitle());
        teacher.setDepartment(departament);
        teacher.setHireDate(dto.getHireDate());

        return mapToDTO(teacherRepository.save(teacher));
    }

    @Override
    public Optional<TeacherDTO> getTeacherById(Long id) {
        return teacherRepository.findById(id).map(this::mapToDTO);
    }

    @Override
    public List<TeacherDTO> getAllTeachers() {
        return teacherRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteTeacherById(Long id) {
        teacherRepository.deleteById(id);
    }

    @Override
    public Optional<TeacherDTO> updateTeacher(Long id, TeacherUpdateDTO dto) {
        Optional<Teacher> optionalTeacher = teacherRepository.findById(id);
        if (optionalTeacher.isEmpty()) {
            return Optional.empty();
        }

        Teacher teacher = optionalTeacher.get();

        Department department = departmentRepository.findById(dto.getDepartamentId())
                .orElseThrow(() -> new RuntimeException("Departament not found"));

        teacher.setAcademicTitle(dto.getAcademicTitle());
        teacher.setDepartment(department);
        teacher.setHireDate(dto.getHireDate());

        return Optional.of(mapToDTO(teacherRepository.save(teacher)));
    }

    private TeacherDTO mapToDTO(Teacher teacher) {
        TeacherDTO dto = new TeacherDTO();
        dto.setId(teacher.getId());
        dto.setUserId(teacher.getUser().getId());
        dto.setAcademicTitle(teacher.getAcademicTitle());
        dto.setDepartamentId(teacher.getDepartment().getId());
        dto.setHireDate(teacher.getHireDate());
        return dto;
    }
}
