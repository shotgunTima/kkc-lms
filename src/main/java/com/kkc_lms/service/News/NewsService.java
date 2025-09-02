package com.kkc_lms.service.News;


import com.kkc_lms.dto.News.CreateNewsDTO;
import com.kkc_lms.entity.*;
import com.kkc_lms.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NewsService {

    private final NewsRepository newsRepository;
    private final StudentRepository studentRepository;
    private final DirectionRepository directionRepository;
    private final GroupRepository groupRepository;
    private final NewsRecipientRepository newsRecipientRepository;

    @Transactional
    public News publishNews(CreateNewsDTO dto) {
        News news = new News();
        news.setTitle(dto.getTitle());
        news.setContent(dto.getContent());
        news.setAttachmentUrl(dto.getAttachmentUrl());
        news.setTargetType(dto.getTargetType());

        // связываем если нужно
        if (dto.getTargetType() == TargetType.DIRECTION) {
            if (dto.getDirectionId() == null) {
                throw new IllegalArgumentException("directionId required for DIRECTION target");
            }
            Direction direction = directionRepository.findById(dto.getDirectionId())
                    .orElseThrow(() -> new IllegalArgumentException("Direction not found"));
            news.setDirection(direction);
        } else if (dto.getTargetType() == TargetType.GROUP) {
            if (dto.getGroupId() == null || dto.getDirectionId() == null) {
                throw new IllegalArgumentException("groupId and directionId required for GROUP target");
            }
            Direction direction = directionRepository.findById(dto.getDirectionId())
                    .orElseThrow(() -> new IllegalArgumentException("Direction not found"));
            Group group = groupRepository.findById(dto.getGroupId())
                    .orElseThrow(() -> new IllegalArgumentException("Group not found"));

            news.setDirection(direction);
            news.setGroup(group);
        }

        News saved = newsRepository.save(news);

        // получаем студентов
        List<Student> recipients;
        switch (dto.getTargetType()) {
            case ALL:
                recipients = studentRepository.findAll();
                break;
            case DIRECTION:
                recipients = studentRepository.findAllByDirection(saved.getDirection());
                break;
            case GROUP:
                recipients = studentRepository.findAllByDirectionAndGroup(saved.getDirection(), saved.getGroup());
                break;
            default:
                recipients = List.of();
        }

        // создаём NewsRecipient
        List<NewsRecipient> recipientsEntities = recipients.stream().map(student -> {
            NewsRecipient nr = new NewsRecipient();
            nr.setNews(saved);
            nr.setStudent(student);
            return nr;
        }).collect(Collectors.toList());

        newsRecipientRepository.saveAll(recipientsEntities);

        return saved;
    }
}
