package com.kkc_lms.controller;

import com.kkc_lms.dto.Student.StudentDTO;
import com.kkc_lms.dto.Student.StudentCreateDTO;
import com.kkc_lms.service.Student.StudentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/students")
public class StudentController {

    private final StudentService studentService;

    @Autowired
    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @GetMapping
    public ResponseEntity<List<StudentDTO>> getAllStudents() {
        return ResponseEntity.ok(studentService.getAllStudents());
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudentDTO> getStudentById(@PathVariable Long id) {
        Optional<StudentDTO> student = studentService.getStudentById(id);
        return student.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<StudentDTO> createStudent(@Valid @RequestBody StudentCreateDTO dto) {
        StudentDTO savedStudent = studentService.saveStudent(dto);
        return ResponseEntity.ok(savedStudent);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudent(@PathVariable Long id) {
        if (studentService.getStudentById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        studentService.deleteStudentById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<StudentDTO> getByStudentIdNumber(@RequestParam String studentIdNumber) {
        return studentService.getByStudentIdNumber(studentIdNumber)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

}
