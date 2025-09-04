package com.kkc_lms.controller;

import com.kkc_lms.dto.News.CreateNewsDTO;
import com.kkc_lms.dto.News.NewsDTO;
import com.kkc_lms.entity.News;
import com.kkc_lms.service.News.NewsService;
import com.kkc_lms.service.Student.StudentService;
import com.kkc_lms.service.Security.CustomUserDetails; // <-- ваш класс
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.util.List;

@RestController
@RequestMapping("/api/news")
@RequiredArgsConstructor
public class NewsController {

    private final NewsService newsService;
    private final StudentService studentService;

    @PostMapping
    public ResponseEntity<News> createNews(@RequestBody CreateNewsDTO dto) {
        News saved = newsService.publishNews(dto);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/student")
    public ResponseEntity<List<NewsDTO>> getForAuthenticatedStudent(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthenticated");
        }

        Object principal = authentication.getPrincipal();
        if (!(principal instanceof CustomUserDetails)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unexpected principal type");
        }

        Long userId = ((CustomUserDetails) principal).getUser().getId();
        List<NewsDTO> list = studentService.getNewsForUser(userId);
        return ResponseEntity.ok(list);
    }
}
