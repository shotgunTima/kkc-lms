package com.kkc_lms.controller;

import com.kkc_lms.dto.Teacher.TeacherCreateDTO;
import com.kkc_lms.dto.Teacher.TeacherDTO;
import com.kkc_lms.dto.Teacher.TeacherUpdateDTO;
import com.kkc_lms.service.Teacher.TeacherService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teachers")
@RequiredArgsConstructor
public class TeacherController {

    private final TeacherService teacherService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public TeacherDTO createTeacher(@ModelAttribute TeacherCreateDTO dto) {
        return teacherService.createTeacher(dto);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public TeacherDTO updateTeacher(@PathVariable Long id, @ModelAttribute TeacherUpdateDTO dto) {
        return teacherService.updateTeacher(id, dto);
    }

    @GetMapping("/{id}")
    public TeacherDTO getTeacher(@PathVariable Long id) {
        return teacherService.getTeacherById(id);
    }

    @GetMapping
    public List<TeacherDTO> getAllTeachers() {
        return teacherService.getAllTeachers();
    }

    @DeleteMapping("/{id}")
    public void deleteTeacher(@PathVariable Long id) {
        teacherService.deleteTeacher(id);
    }
}
