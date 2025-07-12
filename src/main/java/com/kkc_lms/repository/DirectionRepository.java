package com.kkc_lms.repository;

import com.kkc_lms.entity.Direction;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DirectionRepository extends JpaRepository<Direction, Long> {

    boolean existsByNameIgnoreCase(@NotBlank(message = "Название направления не должно быть пустым") String name);
}
