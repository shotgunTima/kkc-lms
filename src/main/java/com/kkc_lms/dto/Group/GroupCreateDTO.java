package com.kkc_lms.dto.Group;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class GroupCreateDTO {

    @NotBlank
    private String name;

    @NotNull
    private Long directionId;

    @NotNull
    private Long curatorId;
}
