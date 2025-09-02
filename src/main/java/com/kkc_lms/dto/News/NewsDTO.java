package com.kkc_lms.dto.News;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class NewsDTO {
    private Long id;
    private String title;
    private String content;
    private String attachmentUrl;
    private String targetType;
    private LocalDateTime createdAt;
    private boolean read;
}
