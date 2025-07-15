package com.kkc_lms.service.Subject;

import com.kkc_lms.dto.Subject.SubjectCreateDTO;
import com.kkc_lms.dto.Subject.SubjectOutputDTO;
import com.kkc_lms.dto.Subject.SubjectUpdateDTO;
import com.kkc_lms.dto.Teacher.TeacherOutputDTO;
import com.kkc_lms.entity.Subject;
import com.kkc_lms.entity.Teacher;
import com.kkc_lms.repository.SubjectRepository;
import com.kkc_lms.repository.TeacherRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SubjectServiceImpl implements SubjectService {

    private final SubjectRepository subjectRepository;
    private final TeacherRepository teacherRepository;

    @Override
    public SubjectOutputDTO create(SubjectCreateDTO dto) {
        Subject subject = new Subject();
        subject.setName(dto.getName());
        subject.setCredits(dto.getCredits());

        List<Teacher> teachers = teacherRepository.findAllById(dto.getTeacherIds());
        subject.setTeachers(teachers);
        subjectRepository.save(subject);
        return toDTO(subject);
    }

    @Override
    public List<SubjectOutputDTO> getAll() {
        return subjectRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public SubjectOutputDTO getById(Long id) {
        return subjectRepository.findById(id)
                .map(this::toDTO)
                .orElseThrow(() -> new RuntimeException("Subject not found"));
    }

    @Override
    public void delete(Long id) {
        subjectRepository.deleteById(id);
    }
    @Override
    public SubjectOutputDTO update(Long id, SubjectUpdateDTO dto) {
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subject not found"));

        subject.setName(dto.getName());
        subject.setCredits(dto.getCredits());

        List<Teacher> teachers = teacherRepository.findAllById(dto.getTeacherIds());
        subject.setTeachers(teachers);

        subjectRepository.save(subject);
        return toDTO(subject);
    }


    private SubjectOutputDTO toDTO(Subject subject) {
        SubjectOutputDTO dto = new SubjectOutputDTO();
        dto.setId(subject.getId());
        dto.setName(subject.getName());
        dto.setCredits(subject.getCredits());

        List<TeacherOutputDTO> teacherDTOs = subject.getTeachers().stream().map(teacher -> {
            TeacherOutputDTO t = new TeacherOutputDTO();
            t.setId(teacher.getId());
            String fullName = teacher.getUser().getFullname();
            t.setFullName(fullName);
            t.setAcademicTitle(teacher.getAcademicTitle());
            return t;
        }).collect(Collectors.toList());

        dto.setTeachers(teacherDTOs);
        return dto;
    }
}
