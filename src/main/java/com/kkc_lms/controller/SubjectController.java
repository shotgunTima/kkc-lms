package com.kkc_lms.controller;

import com.kkc_lms.dto.Subject.SubjectCreateDTO;
import com.kkc_lms.dto.Subject.SubjectOutputDTO;
import com.kkc_lms.dto.Subject.SubjectUpdateDTO;
import com.kkc_lms.service.Subject.SubjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subjects")
@RequiredArgsConstructor
public class SubjectController {

    private final SubjectService subjectService;

    @PostMapping
    public SubjectOutputDTO create(@RequestBody SubjectCreateDTO dto) {
        return subjectService.create(dto);
    }

    @GetMapping
    public List<SubjectOutputDTO> getAll() {
        return subjectService.getAll();
    }

    @GetMapping("/{id}")
    public SubjectOutputDTO getById(@PathVariable Long id) {
        return subjectService.getById(id);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        subjectService.delete(id);
    }
    @PutMapping("/{id}")
    public ResponseEntity<SubjectOutputDTO> update(@PathVariable Long id, @RequestBody SubjectUpdateDTO dto) {
        return ResponseEntity.ok(subjectService.update(id, dto));
    }

}

