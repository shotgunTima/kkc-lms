package com.kkc_lms.service.Subject;

import com.kkc_lms.dto.Subject.SubjectCreateDTO;
import com.kkc_lms.dto.Subject.SubjectDTO;
import com.kkc_lms.entity.Subject;
import com.kkc_lms.entity.Teacher;
import com.kkc_lms.repository.SubjectRepository;
import com.kkc_lms.repository.TeacherRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class SubjectServiceImpl implements SubjectService {

    private final SubjectRepository subjectRepository;
    private final TeacherRepository teacherRepository;

    @Override
    public Subject createSubject(SubjectCreateDTO dto) {
        if (subjectRepository.existsByNameIgnoreCase(dto.getName())) {
            throw new IllegalArgumentException("Subject name must be unique");
        }
        Subject subject = new Subject();
        subject.setName(dto.getName());
        subject.setCredits(dto.getCredits());

        Set<Teacher> teachers = new HashSet<>(teacherRepository.findAllById(dto.getTeacherIds()));
        subject.setTeachers(teachers);
        teachers.forEach(teacher -> teacher.getSubjects().add(subject));

        return subjectRepository.save(subject);
    }

    @Override
    public List<SubjectDTO> getAllSubjects() {
        return subjectRepository.findAll().stream()
                .map(this::mapToDTO)
                .toList();
    }

    @Override
    public SubjectDTO getSubjectById(Long id) {
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subject not found"));
        return mapToDTO(subject);
    }

    @Override
    public Subject updateSubject(Long id, SubjectCreateDTO dto) {
        if (subjectRepository.existsByNameIgnoreCaseAndIdNot(dto.getName(), id)) {
            throw new IllegalArgumentException("Subject name must be unique");
        }
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subject not found"));

        subject.setName(dto.getName());
        subject.setCredits(dto.getCredits());

        // Удаляем старые связи ManyToMany с учителями
        subject.getTeachers().forEach(teacher -> teacher.getSubjects().remove(subject));
        subject.getTeachers().clear();

        // Добавляем новые связи
        Set<Teacher> teachers = new HashSet<>(teacherRepository.findAllById(dto.getTeacherIds()));
        subject.setTeachers(teachers);
        teachers.forEach(teacher -> teacher.getSubjects().add(subject));

        return subjectRepository.save(subject);
    }

    @Override
    public void deleteSubject(Long id) {
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subject not found"));

        // Очищаем связи ManyToMany у учителей
        subject.getTeachers().forEach(teacher -> teacher.getSubjects().remove(subject));
        subject.getTeachers().clear();

        subjectRepository.delete(subject);
    }

    private SubjectDTO mapToDTO(Subject subject) {
        SubjectDTO dto = new SubjectDTO();
        dto.setId(subject.getId());
        dto.setName(subject.getName());
        dto.setCredits(subject.getCredits());

        Set<Teacher> teachers = subject.getTeachers() != null ? subject.getTeachers() : Set.of();

        dto.setTeacherIds(
                teachers.stream()
                        .map(Teacher::getId)
                        .toList()
        );

        dto.setTeacherNames(
                teachers.stream()
                        .map(t -> t.getUser().getFullname())
                        .toList()
        );

        return dto;
    }
}
