package com.kkc_lms.service.Direction;

import com.kkc_lms.dto.Direction.DirectionCreateDTO;
import com.kkc_lms.dto.Direction.DirectionDTO;
import com.kkc_lms.entity.Department;
import com.kkc_lms.entity.Direction;
import com.kkc_lms.repository.DepartmentRepository;
import com.kkc_lms.repository.DirectionRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DirectionServiceImpl implements DirectionService {

    private final DirectionRepository directionRepository;
    private final DepartmentRepository departmentRepository;

    @Override
    public DirectionDTO createDirection(DirectionCreateDTO dto) {
        Department dept = departmentRepository.findById(dto.getDepartmentId())
                .orElseThrow(() -> new EntityNotFoundException("Кафедра не найдена"));

        Direction dir = new Direction();
        dir.setName(dto.getName());
        dir.setDepartment(dept);
        Direction saved = directionRepository.save(dir);
        return mapToDTO(saved);
    }

    @Override
    public Optional<DirectionDTO> getDirectionById(Long id) {
        return directionRepository.findById(id).map(this::mapToDTO);
    }

    @Override
    public List<DirectionDTO> getAllDirections() {
        return directionRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public DirectionDTO updateDirection(Long id, DirectionCreateDTO dto) {
        Direction existing = directionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Направление не найдено"));
        Department dept = departmentRepository.findById(dto.getDepartmentId())
                .orElseThrow(() -> new EntityNotFoundException("Кафедра не найдена"));

        existing.setName(dto.getName());
        existing.setDepartment(dept);
        Direction updated = directionRepository.save(existing);
        return mapToDTO(updated);
    }

    @Override
    public void deleteDirectionById(Long id) {
        if (!directionRepository.existsById(id)) {
            throw new EntityNotFoundException("Направление не найдено");
        }
        directionRepository.deleteById(id);
    }

    private DirectionDTO mapToDTO(Direction dir) {
        DirectionDTO dto = new DirectionDTO();
        dto.setId(dir.getId());
        dto.setName(dir.getName());
        if (dir.getDepartment() != null) {
            dto.setDepartmentId(dir.getDepartment().getId());
            dto.setDepartmentName(dir.getDepartment().getName());
        }
        return dto;
    }
}