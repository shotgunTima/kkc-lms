// EnumController.java
package com.kkc_lms.controller;

import com.kkc_lms.entity.AcademicTitles;
import com.kkc_lms.entity.Course;
import com.kkc_lms.entity.StudentStatus;
import com.kkc_lms.entity.TeacherStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/enums")
public class EnumController {

    @GetMapping("/academic-titles")
    public List<Map<String, String>> getAcademicTitles() {
        return Arrays.stream(AcademicTitles.values())
                .map(title -> Map.of(
                        "value", title.name(),
                        "label", title.getLabel()
                ))
                .collect(Collectors.toList());
    }

    @GetMapping("/teacher-status")
    public List<Map<String, String>> getTeacherStatuses() {
        return Arrays.stream(TeacherStatus.values())
                .map(status -> Map.of(
                        "value", status.name(),
                        "label", status.getLabel()
                ))
                .collect(Collectors.toList());
    }
    @GetMapping("/student-status")
    public List<Map<String,String>> getStudentStatuses(){
        return Arrays.stream(StudentStatus.values())
                .map(st_status -> Map.of(
                        "value", st_status.name(),
                        "label", st_status.getLabel()
                ))
                .collect(Collectors.toList());
    }

    @GetMapping("/courses")
    public List<Map<String,String>> getCourses(){
        return Arrays.stream(Course.values())
                .map(course -> Map.of(
                        "value", course.name(),
                        "label", course.getLabel()
                ))
                .collect(Collectors.toList());
    }

}
