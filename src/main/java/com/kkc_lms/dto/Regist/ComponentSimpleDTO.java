package com.kkc_lms.dto.Regist;
import com.kkc_lms.entity.ComponentType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ComponentSimpleDTO {
    private Long id;
    private ComponentType type;
    private int hours;
}