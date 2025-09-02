package com.kkc_lms.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "news")
public class News {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Заголовок новости
    @Column(nullable = false)
    private String title;

    // Текст новости
    @Column(columnDefinition = "TEXT")
    private String content;

    // Файл (ссылка на фото/документ в хранилище)
    private String attachmentUrl;

    // Кому предназначено: ALL / DIRECTION / GROUP
    @Enumerated(EnumType.STRING)
    private TargetType targetType;

    // Если для направления
    @ManyToOne
    @JoinColumn(name = "direction_id")
    private Direction direction;

    // Если для группы
    @ManyToOne
    @JoinColumn(name = "group_id")
    private Group group;

    private LocalDateTime createdAt = LocalDateTime.now();
}
