package com.kkc_lms.controller;

import com.kkc_lms.dto.Subject.SubjectCreateDTO;
import com.kkc_lms.dto.Subject.SubjectDTO;
import com.kkc_lms.entity.Subject;
import com.kkc_lms.service.Subject.SubjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subjects")
@RequiredArgsConstructor
public class SubjectController {

    private final SubjectService subjectService;

    @PostMapping
    public Subject createSubject(@RequestBody SubjectCreateDTO dto) {
        return subjectService.createSubject(dto);
    }

    @GetMapping
    public List<SubjectDTO> getAllSubjects() {
        return subjectService.getAllSubjects();
    }

    @GetMapping("/{id}")
    public SubjectDTO getSubjectById(@PathVariable Long id) {
        return subjectService.getSubjectById(id);
    }

    @PutMapping("/{id}")
    public Subject updateSubject(@PathVariable Long id, @RequestBody SubjectCreateDTO dto) {
        return subjectService.updateSubject(id, dto);
    }

    @DeleteMapping("/{id}")
    public void deleteSubject(@PathVariable Long id) {
        subjectService.deleteSubject(id);
    }
}
