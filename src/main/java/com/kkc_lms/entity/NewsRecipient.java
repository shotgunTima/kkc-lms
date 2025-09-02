package com.kkc_lms.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "news_recipients")
@Data
public class NewsRecipient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "news_id")
    private News news;

    @ManyToOne(optional = false)
    @JoinColumn(name = "student_id")
    private Student student;

    @Column(name = "is_read", nullable = false)
    private boolean read = false;

    private LocalDateTime createdAt = LocalDateTime.now();
}
