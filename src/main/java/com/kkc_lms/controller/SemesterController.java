package com.kkc_lms.controller;

import com.kkc_lms.dto.Semester.SemesterDTO;
import com.kkc_lms.dto.Semester.SemesterCreateDTO;
import com.kkc_lms.dto.Semester.SemesterUpdateDTO;
import com.kkc_lms.service.Semester.SemesterService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/semesters")
@RequiredArgsConstructor
public class SemesterController {

    private final SemesterService semesterService;

    @PostMapping
    public ResponseEntity<SemesterDTO> createSemester(@RequestBody SemesterCreateDTO dto) {
        return ResponseEntity.ok(semesterService.createSemester(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SemesterDTO> updateSemester(@PathVariable Long id,
                                                      @RequestBody SemesterUpdateDTO dto) {
        return ResponseEntity.ok(semesterService.updateSemester(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSemester(@PathVariable Long id) {
        semesterService.deleteSemester(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<SemesterDTO> getSemesterById(@PathVariable Long id) {
        return ResponseEntity.ok(semesterService.getSemesterById(id));
    }

    @GetMapping
    public ResponseEntity<List<SemesterDTO>> getAllSemesters() {
        return ResponseEntity.ok(semesterService.getAllSemesters());
    }
}
