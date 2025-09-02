package com.kkc_lms.controller;

import com.kkc_lms.dto.News.CreateNewsDTO;
import com.kkc_lms.entity.News;
import com.kkc_lms.service.News.NewsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/news")
@RequiredArgsConstructor
public class NewsController {

    private final NewsService newsService;

    @PostMapping
    public ResponseEntity<News> createNews(@RequestBody CreateNewsDTO dto) {
        News saved = newsService.publishNews(dto);
        return ResponseEntity.ok(saved);
    }
}
