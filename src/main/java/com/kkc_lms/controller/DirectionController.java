package com.kkc_lms.controller;

import com.kkc_lms.dto.Direction.DirectionCreateDTO;
import com.kkc_lms.dto.Direction.DirectionDTO;
import com.kkc_lms.entity.Direction;
import com.kkc_lms.entity.Group;
import com.kkc_lms.repository.DirectionRepository;
import com.kkc_lms.repository.GroupRepository;
import com.kkc_lms.service.Direction.DirectionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/directions")
@RequiredArgsConstructor
public class DirectionController {

    private final DirectionService directionService;
    private final DirectionRepository directionRepository;
    private final GroupRepository groupRepository;

    @GetMapping
    public List<Direction> all() {
        return directionRepository.findAll();
    }

    @GetMapping("/{id}/groups")
    public List<Group> groups(@PathVariable Long id) {
        return groupRepository.findAllByDirectionId(id);
    }

    @PostMapping
    public ResponseEntity<DirectionDTO> createDirection(@RequestBody @Valid DirectionCreateDTO dto) {
        DirectionDTO created = directionService.createDirection(dto);
        return ResponseEntity.ok(created);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DirectionDTO> getDirectionById(@PathVariable Long id) {
        return directionService.getDirectionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<DirectionDTO>> getAllDirections() {
        return ResponseEntity.ok(directionService.getAllDirections());
    }

    @PutMapping("/{id}")
    public ResponseEntity<DirectionDTO> updateDirection(
            @PathVariable Long id,
            @RequestBody @Valid DirectionCreateDTO dto
    ) {
        DirectionDTO updated = directionService.updateDirection(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDirection(@PathVariable Long id) {
        directionService.deleteDirectionById(id);
        return ResponseEntity.noContent().build();
    }

}
