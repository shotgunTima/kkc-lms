package com.kkc_lms.controller;

import com.kkc_lms.entity.Course;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    @GetMapping
    public List<Course> getAllCourses() {
        return Arrays.asList(Course.values());
    }
}
