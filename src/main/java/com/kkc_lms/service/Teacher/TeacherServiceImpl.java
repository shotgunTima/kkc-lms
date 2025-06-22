package com.kkc_lms.service.Teacher;

import com.kkc_lms.dto.Teacher.TeacherCreateDTO;
import com.kkc_lms.dto.Teacher.TeacherDTO;
import com.kkc_lms.dto.Teacher.TeacherUpdateDTO;
import com.kkc_lms.entity.Teacher;
import com.kkc_lms.entity.User;
import com.kkc_lms.repository.TeacherRepository;
import com.kkc_lms.repository.UserRepository;
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


    @Autowired
    public TeacherServiceImpl(
            TeacherRepository teacherRepository,
            UserRepository userRepository

    ) {
        this.teacherRepository = teacherRepository;
        this.userRepository = userRepository;
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



        Teacher teacher = new Teacher();
        teacher.setUser(user);
        teacher.setAcademicTitle(dto.getAcademicTitle());
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



        teacher.setAcademicTitle(dto.getAcademicTitle());

        teacher.setHireDate(dto.getHireDate());

        return Optional.of(mapToDTO(teacherRepository.save(teacher)));
    }

    private TeacherDTO mapToDTO(Teacher teacher) {
        TeacherDTO dto = new TeacherDTO();
        dto.setId(teacher.getId());
        dto.setUserId(teacher.getUser().getId());
        dto.setAcademicTitle(teacher.getAcademicTitle());

        dto.setHireDate(teacher.getHireDate());
        return dto;
    }
}
