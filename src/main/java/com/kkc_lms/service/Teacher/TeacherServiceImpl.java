package com.kkc_lms.service.Teacher;

import com.kkc_lms.dto.Teacher.TeacherCreateDTO;
import com.kkc_lms.dto.Teacher.TeacherDTO;
import com.kkc_lms.dto.Teacher.TeacherUpdateDTO;
import com.kkc_lms.entity.*;
import com.kkc_lms.repository.TeacherRepository;
import com.kkc_lms.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TeacherServiceImpl implements TeacherService {

    private final TeacherRepository teacherRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public TeacherDTO createTeacher(TeacherCreateDTO dto) {
        if (userRepository.existsByUsername(dto.getUsername())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Пользователь с таким username уже существует");
        }

        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Пользователь с таким email уже существует");
        }

        User user = new User();
        user.setUsername(dto.getUsername());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setEmail(dto.getEmail());
        user.setFullname(dto.getFullname());
        user.setPhonenum(dto.getPhonenum());
        user.setAddress(dto.getAddress());
        user.setRole(Role.TEACHER);
        userRepository.save(user);

        Teacher teacher = new Teacher();
        teacher.setUser(user);
        teacher.setAcademicTitle(dto.getAcademicTitle() != null ? dto.getAcademicTitle() : AcademicTitles.TEACHER);
        teacher.setHireDate(dto.getHireDate() != null ? dto.getHireDate() : LocalDate.now());
        teacher.setTeacherStatus(dto.getTeacherStatus() != null ? dto.getTeacherStatus() : TeacherStatus.ACTIVE);
        teacherRepository.save(teacher);

        return toDTO(teacher);
    }

    @Override
    @Transactional
    public void createForUser(User user) {
        if (teacherRepository.findByUserId(user.getId()).isPresent()) {
            return;
        }
        Teacher teacher = new Teacher();
        teacher.setUser(user);
        teacher.setHireDate(LocalDate.now());
        teacher.setAcademicTitle(AcademicTitles.TEACHER);
        teacher.setTeacherStatus(TeacherStatus.ACTIVE);
        teacherRepository.save(teacher);
    }

    @Override
    @Transactional
    public void createForUserWithDetails(User user, AcademicTitles academicTitle, TeacherStatus teacherStatus, LocalDate hireDate) {
        if (teacherRepository.findByUserId(user.getId()).isPresent()) {
            return;
        }
        Teacher teacher = new Teacher();
        teacher.setUser(user);
        teacher.setHireDate(hireDate != null ? hireDate : LocalDate.now());
        teacher.setAcademicTitle(academicTitle != null ? academicTitle : AcademicTitles.TEACHER);
        teacher.setTeacherStatus(teacherStatus != null ? teacherStatus : TeacherStatus.ACTIVE);
        teacherRepository.save(teacher);
    }

    @Override
    @Transactional
    public void updateTeacherDetails(Long userId, AcademicTitles academicTitle, TeacherStatus teacherStatus, LocalDate hireDate) {
        Teacher teacher = teacherRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));
        teacher.setAcademicTitle(academicTitle != null ? academicTitle : teacher.getAcademicTitle());
        teacher.setTeacherStatus(teacherStatus != null ? teacherStatus : teacher.getTeacherStatus());
        teacher.setHireDate(hireDate != null ? hireDate : teacher.getHireDate());
        teacherRepository.save(teacher);
    }

    @Override
    @Transactional
    public TeacherDTO updateTeacher(Long id, TeacherUpdateDTO dto) {
        Teacher teacher = teacherRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));
        User user = teacher.getUser();
        user.setUsername(dto.getUsername());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setEmail(dto.getEmail());
        user.setFullname(dto.getFullname());
        user.setPhonenum(dto.getPhonenum());
        user.setAddress(dto.getAddress());
        userRepository.save(user);

        teacher.setAcademicTitle(dto.getAcademicTitle());
        teacher.setHireDate(dto.getHireDate());
        teacher.setTeacherStatus(dto.getTeacherStatus());
        teacherRepository.save(teacher);

        return toDTO(teacher);
    }

    @Override
    @Transactional
    public void deleteByUserId(Long userId) {
        teacherRepository.deleteByUserId(userId);
    }


    @Transactional
    public void deleteTeacher(Long id) {
        Teacher teacher = teacherRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));

        for (Subject subject : teacher.getSubjects()) {
            subject.getTeachers().remove(teacher);
        }
        teacher.getSubjects().clear();

        // При удалении преподавателя удаляется пользователь, так как у User cascade.ALL и orphanRemoval
        teacherRepository.delete(teacher);
    }


    @Override
    public TeacherDTO getTeacherById(Long id) {
        return teacherRepository.findById(id)
                .map(this::toDTO)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));
    }

    @Override
    public List<TeacherDTO> getAllTeachers() {
        return teacherRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private TeacherDTO toDTO(Teacher teacher) {
        TeacherDTO dto = new TeacherDTO();
        dto.setId(teacher.getId());
        dto.setUserId(teacher.getUser().getId());
        dto.setUsername(teacher.getUser().getUsername());
        dto.setEmail(teacher.getUser().getEmail());
        dto.setFullname(teacher.getUser().getFullname());
        dto.setAcademicTitle(teacher.getAcademicTitle());
        dto.setPhonenum(teacher.getUser().getPhonenum());
        dto.setHireDate(teacher.getHireDate());
        dto.setTeacherStatus(teacher.getTeacherStatus());
        List<String> subjectNames = teacher.getSubjects().stream()
                .map(Subject::getName)
                .collect(Collectors.toList());
        dto.setSubjectNames(subjectNames);
        return dto;
    }
}
