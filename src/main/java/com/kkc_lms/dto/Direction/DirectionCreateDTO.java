package com.kkc_lms.dto.Direction;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class DirectionCreateDTO {
    @NotBlank(message = "Название направления не должно быть пустым")
    private String name;

    @NotNull(message = "Требуется id кафедры")
    private Long departmentId;
}