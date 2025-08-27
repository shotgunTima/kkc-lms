package com.kkc_lms.dto.User;

import lombok.Data;

@Data
public class AssignTeacherDTO {
    private Long componentId;
    private Long teacherId;
    private Long groupId;
}
