package com.kkc_lms.dto.News;

import com.kkc_lms.entity.TargetType;
import lombok.Data;

@Data
public class CreateNewsDTO {
    private String title;
    private String content;
    private String attachmentUrl; // optional
    private TargetType targetType; // ALL, DIRECTION, GROUP

    // если targetType == DIRECTION
    private Long directionId;

    // если targetType == GROUP
    private Long groupId;
}
