package com.kkc_lms.dto;

import lombok.Data;

@Data
public class FilterDTO {
    private Long semesterId;
    private Long directionId;
    private String course; // "1" / "2" / "FIRST" / "SECOND"
}
