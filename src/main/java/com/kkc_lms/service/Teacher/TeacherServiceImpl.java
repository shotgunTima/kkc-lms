package com.kkc_lms.service.Teacher;

import com.kkc_lms.dto.Teacher.TeacherCreateDTO;
import com.kkc_lms.dto.Teacher.TeacherOutputDTO;
import com.kkc_lms.dto.Teacher.TeacherUpdateDTO;
import com.kkc_lms.entity.Subject;
import com.kkc_lms.entity.Teacher;
import com.kkc_lms.entity.Teacher.TeacherStatus;
import com.kkc_lms.entity.User;
import com.kkc_lms.repository.SubjectRepository;
import com.kkc_lms.repository.TeacherRepository;
import com.kkc_lms.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TeacherServiceImpl implements TeacherService {

    private final TeacherRepository teacherRepository;
    private final UserRepository userRepository;
    private final SubjectRepository subjectRepository;

    @Override
    public TeacherOutputDTO create(TeacherCreateDTO dto) {
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Subject> subjects = subjectRepository.findAllById(dto.getSubjectIds());

        Teacher teacher = new Teacher();
        teacher.setUser(user);
        teacher.setAcademicTitle(dto.getAcademicTitle());
        teacher.setHireDate(dto.getHireDate());
        teacher.setStatus(TeacherStatus.valueOf(dto.getStatus()));
        teacher.setSubjects(subjects);

        teacherRepository.save(teacher);
        return toDTO(teacher);
    }
    public void createForUser(User user) {
        Teacher teacher = new Teacher();
        teacher.setUser(user);
        teacher.setStatus(TeacherStatus.ACTIVE); // или другой дефолтный статус
        teacherRepository.save(teacher);
    }


    @Override
    public List<TeacherOutputDTO> getAll() {
        return teacherRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public TeacherOutputDTO getById(Long id) {
        return teacherRepository.findById(id)
                .map(this::toDTO)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));
    }

    @Override
    public void delete(Long id) {
        teacherRepository.deleteById(id);
    }
    @Override
    public TeacherOutputDTO update(Long id, TeacherUpdateDTO dto) {
        Teacher teacher = teacherRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));

        teacher.setAcademicTitle(dto.getAcademicTitle());
        teacher.setHireDate(dto.getHireDate());
        teacher.setStatus(TeacherStatus.valueOf(dto.getStatus()));

        List<Subject> subjects = subjectRepository.findAllById(dto.getSubjectIds());
        teacher.setSubjects(subjects);

        teacherRepository.save(teacher);
        return toDTO(teacher);
    }


    private TeacherOutputDTO toDTO(Teacher teacher) {
        TeacherOutputDTO dto = new TeacherOutputDTO();
        dto.setId(teacher.getId());
        dto.setFullName(teacher.getUser().getFullname());
        dto.setAcademicTitle(teacher.getAcademicTitle());
        dto.setHireDate(teacher.getHireDate());
        dto.setStatus(teacher.getStatus().name());

        List<String> subjectNames = teacher.getSubjects().stream()
                .map(Subject::getName)
                .collect(Collectors.toList());
        dto.setSubjects(subjectNames);

        return dto;
    }
}
