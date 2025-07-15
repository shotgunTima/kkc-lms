package com.kkc_lms.controller;

import com.kkc_lms.dto.Teacher.TeacherCreateDTO;
import com.kkc_lms.dto.Teacher.TeacherOutputDTO;
import com.kkc_lms.dto.Teacher.TeacherUpdateDTO;
import com.kkc_lms.service.Teacher.TeacherService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teachers")
@RequiredArgsConstructor
public class TeacherController {

    private final TeacherService teacherService;

    @PostMapping
    public TeacherOutputDTO create(@RequestBody TeacherCreateDTO dto) {
        return teacherService.create(dto);
    }

    @GetMapping
    public List<TeacherOutputDTO> getAll() {
        return teacherService.getAll();
    }

    @GetMapping("/{id}")
    public TeacherOutputDTO getById(@PathVariable Long id) {
        return teacherService.getById(id);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        teacherService.delete(id);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TeacherOutputDTO> update(@PathVariable Long id, @RequestBody TeacherUpdateDTO dto) {
        TeacherOutputDTO updated = teacherService.update(id, dto);
        return ResponseEntity.ok(updated);
    }

}
