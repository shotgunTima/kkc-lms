package com.kkc_lms.service.Direction;

import com.kkc_lms.dto.Direction.DirectionCreateDTO;
import com.kkc_lms.dto.Direction.DirectionDTO;

import java.util.List;
import java.util.Optional;

public interface DirectionService {
    DirectionDTO createDirection(DirectionCreateDTO dto);
    Optional<DirectionDTO> getDirectionById(Long id);
    List<DirectionDTO> getAllDirections();
    DirectionDTO updateDirection(Long id, DirectionCreateDTO dto);
    void deleteDirectionById(Long id);
}
