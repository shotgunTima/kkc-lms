package com.kkc_lms.controller;

import com.kkc_lms.dto.Student.StudentDTO;
import com.kkc_lms.dto.Student.StudentCreateDTO;
import com.kkc_lms.entity.Student;
import com.kkc_lms.service.Student.StudentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
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


    @GetMapping("/by-course-and-direction")
    public ResponseEntity<List<StudentDTO>> getStudentsByCourseAndDirection(
            @RequestParam(value = "courseNumber", required = false) Integer courseNumber,
            @RequestParam(value = "course", required = false) Integer courseAlias,
            @RequestParam("directionId") Long directionId
    ) {
        Integer courseNum = courseNumber != null ? courseNumber : courseAlias;
        if (courseNum == null) {
            return ResponseEntity.badRequest()
                    .body(Collections.emptyList()); // либо throw new ResponseStatusException(...)
        }

        List<Student> students = studentService.getStudentsByCourseAndDirection(courseNum, directionId);

        List<StudentDTO> dtos = students.stream().map(student -> {
            StudentDTO dto = new StudentDTO();
            dto.setId(student.getId());
            dto.setStudentIdNumber(student.getStudentIdNumber());
            dto.setCourse(student.getCourse());
            if (student.getDirection() != null) {
                dto.setDirectionId(student.getDirection().getId());
                dto.setDirectionName(student.getDirection().getName());
            }
            if (student.getGroup() != null) {
                dto.setGroupId(student.getGroup().getId());
                dto.setGroupName(student.getGroup().getName());
            }
            dto.setTotalCredits(student.getTotalCredits());
            dto.setAdmissionYear(student.getAdmissionYear());
            return dto;
        }).toList();

        return ResponseEntity.ok(dtos);
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
