package com.kkc_lms.service.Direction;

import com.kkc_lms.dto.Direction.DirectionCreateDTO;
import com.kkc_lms.dto.Direction.DirectionDTO;
import com.kkc_lms.entity.Direction;
import com.kkc_lms.repository.DirectionRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DirectionServiceImpl implements DirectionService {

    private final DirectionRepository directionRepository;

    @Override
    public DirectionDTO createDirection(DirectionCreateDTO dto) {
        if (directionRepository.existsByNameIgnoreCase(dto.getName())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Направление с таким названием уже существует");
        }
        Direction direction = new Direction();
        direction.setName(dto.getName());

        Direction saved = directionRepository.save(direction);
        return toDTO(saved);
    }

    @Override
    public Optional<DirectionDTO> getDirectionById(Long id) {
        return directionRepository.findById(id).map(this::toDTO);
    }

    @Override
    public List<DirectionDTO> getAllDirections() {
        return directionRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public DirectionDTO updateDirection(Long id, DirectionCreateDTO dto) {
        Direction direction = directionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Направление не найдено"));

        // ✅ Только если имя другое и уже есть такое — ошибка
        if (!direction.getName().equalsIgnoreCase(dto.getName()) &&
                directionRepository.existsByNameIgnoreCase(dto.getName())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Направление с таким названием уже существует");
        }

        direction.setName(dto.getName());

        Direction updated = directionRepository.save(direction);
        return toDTO(updated);
    }



    @Override
    public void deleteDirectionById(Long id) {
        if (!directionRepository.existsById(id)) {
            throw new EntityNotFoundException("Направление не найдено");
        }
        directionRepository.deleteById(id);
    }

    private DirectionDTO toDTO(Direction direction) {
        DirectionDTO dto = new DirectionDTO();
        dto.setId(direction.getId());
        dto.setName(direction.getName());
        return dto;
    }
}
