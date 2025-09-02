package com.kkc_lms.service.impl;

import com.kkc_lms.dto.Semester.SemesterCreateDTO;
import com.kkc_lms.dto.Semester.SemesterDTO;
import com.kkc_lms.dto.Semester.SemesterUpdateDTO;
import com.kkc_lms.entity.Semester;
import com.kkc_lms.repository.SemesterRepository;
import com.kkc_lms.service.Semester.SemesterService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SemesterServiceImpl implements SemesterService {

    private final SemesterRepository semesterRepository;

    private SemesterDTO mapToDTO(Semester semester) {
        SemesterDTO dto = new SemesterDTO();
        dto.setId(semester.getId());
        dto.setTerm(semester.getTerm());
        dto.setName(semester.getName());
        dto.setYear(semester.getYear());
        dto.setStartDate(semester.getStartDate());
        dto.setEndDate(semester.getEndDate());
        return dto;
    }

    @Override
    public SemesterDTO createSemester(SemesterCreateDTO dto) {
        if (semesterRepository.existsByTermAndYear(dto.getTerm(), dto.getYear())) {
            throw new RuntimeException("Semester with this term and year already exists");
        }

        Semester semester = new Semester();
        semester.setTerm(dto.getTerm());
        semester.setName(dto.getName());
        semester.setYear(dto.getYear());
        semester.setStartDate(dto.getStartDate());
        semester.setEndDate(dto.getEndDate());

        return mapToDTO(semesterRepository.save(semester));
    }

    @Override
    public SemesterDTO updateSemester(Long id, SemesterUpdateDTO dto) {
        Semester semester = semesterRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Semester not found"));

        semester.setTerm(dto.getTerm());
        semester.setName(dto.getName());
        semester.setYear(dto.getYear());
        semester.setStartDate(dto.getStartDate());
        semester.setEndDate(dto.getEndDate());

        return mapToDTO(semesterRepository.save(semester));
    }

    @Override
    public void deleteSemester(Long id) {
        if (!semesterRepository.existsById(id)) {
            throw new RuntimeException("Semester not found");
        }
        semesterRepository.deleteById(id);
    }

    @Override
    public SemesterDTO getSemesterById(Long id) {
        return semesterRepository.findById(id)
                .map(this::mapToDTO)
                .orElseThrow(() -> new RuntimeException("Semester not found"));
    }

    @Override
    public List<SemesterDTO> getAllSemesters() {
        return semesterRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
}
