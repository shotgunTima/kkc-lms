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

    private String generateDefaultCode() {
        long count = subjectRepository.count() + 1; // можно sequence
        return String.format("SUB-%04d", count);
    }

    @Override
    public Subject createSubject(SubjectCreateDTO dto) {
        if (subjectRepository.existsByNameIgnoreCase(dto.getName())) {
            throw new IllegalArgumentException("Subject name must be unique");
        }
        Subject subject = new Subject();
        subject.setName(dto.getName());
        subject.setCredits(dto.getCredits());
        subject.setDescription(dto.getDescription());
        subject.setCode(
                (dto.getCode() == null || dto.getCode().isBlank())
                        ? generateDefaultCode()
                        : dto.getCode().trim()
        );

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
        subject.setCode(
                (dto.getCode() == null || dto.getCode().isBlank())
                        ? subject.getCode() // оставляем старый код
                        : dto.getCode().trim()
        );
        subject.setDescription(dto.getDescription());

        return subjectRepository.save(subject);
    }

    @Override
    public void deleteSubject(Long id) {
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subject not found"));

        subjectRepository.delete(subject);
    }

    private SubjectDTO mapToDTO(Subject subject) {
        SubjectDTO dto = new SubjectDTO();
        dto.setId(subject.getId());
        dto.setName(subject.getName());
        dto.setCredits(subject.getCredits());
        dto.setCode(subject.getCode());
        dto.setDescription(subject.getDescription());

        return dto;
    }
}
