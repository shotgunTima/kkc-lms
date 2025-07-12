package com.kkc_lms.dto.Direction;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class DirectionCreateDTO {
    @NotBlank(message = "Название направления не должно быть пустым")
    private String name;

}