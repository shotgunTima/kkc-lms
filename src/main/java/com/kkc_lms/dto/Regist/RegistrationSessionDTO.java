package com.kkc_lms.dto.Regist;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegistrationSessionDTO {
    private Long id;
    private Long semesterId;
    private String semesterName; // опционально
    private Long directionId;
    private String directionName; // опционально
    private String course; // Course.name() или course.toString()
    private int year;
    private boolean open;
    private LocalDateTime openedAt;
    private List<RegistrationSlotDTO> slots = new ArrayList<>();
}