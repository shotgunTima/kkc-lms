package com.kkc_lms.controller;

import com.kkc_lms.dto.Teacher.TeacherCreateDTO;
import com.kkc_lms.dto.Teacher.TeacherDTO;
import com.kkc_lms.dto.Teacher.TeacherUpdateDTO;
import com.kkc_lms.service.Teacher.TeacherService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/teachers")
public class TeacherController {

    private final TeacherService teacherService;

    @Autowired
    public TeacherController(TeacherService teacherService) {
        this.teacherService = teacherService;
    }

    @GetMapping
    public ResponseEntity<List<TeacherDTO>> getAllTeachers() {
        return ResponseEntity.ok(teacherService.getAllTeachers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TeacherDTO> getTeacherById(@PathVariable Long id) {
        Optional<TeacherDTO> teacher = teacherService.getTeacherById(id);
        return teacher.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<TeacherDTO> createTeacher(@Valid @RequestBody TeacherCreateDTO dto) {
        TeacherDTO savedTeacher = teacherService.saveTeacher(dto);
        return ResponseEntity.ok(savedTeacher);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TeacherDTO> updateTeacher(@PathVariable Long id, @Valid @RequestBody TeacherUpdateDTO dto) {
        Optional<TeacherDTO> updatedTeacher = teacherService.updateTeacher(id, dto);
        return updatedTeacher.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTeacher(@PathVariable Long id) {
        if (teacherService.getTeacherById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        teacherService.deleteTeacherById(id);
        return ResponseEntity.noContent().build();
    }
}
