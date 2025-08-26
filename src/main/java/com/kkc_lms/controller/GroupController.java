package com.kkc_lms.controller;

import com.kkc_lms.dto.Group.GroupCreateDTO;
import com.kkc_lms.dto.Group.GroupCuratorAssignDTO;
import com.kkc_lms.dto.Group.GroupDTO;
import com.kkc_lms.dto.Student.StudentDTO;
import com.kkc_lms.entity.Course;
import com.kkc_lms.service.Group.GroupService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/groups")
public class GroupController {

    private final GroupService groupService;
    @PostMapping("/transfer-student")
    public ResponseEntity<?> transferStudent(
            @RequestParam Long studentId,
            @RequestParam Long targetGroupId,
            @RequestParam(defaultValue = "false") boolean force) {
        try {
            StudentDTO dto = groupService.transferStudentToGroup(studentId, targetGroupId, force);
            return ResponseEntity.ok(dto);
        } catch (EntityNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", ex.getMessage()));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        } catch (IllegalStateException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", ex.getMessage()));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Unexpected error", "detail", ex.getMessage()));
        }
    }

    @PostMapping("/students")
    public ResponseEntity<Map<String, Object>> getGroupStudents(@RequestParam Long groupId) {
        Map<String, Object> response = groupService.getGroupStudents(groupId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/distribute")
    public ResponseEntity<List<GroupDTO>> distributeStudents(
            @RequestParam Integer courseNumber,
            @RequestParam Long directionId) {
        List<GroupDTO> groups = groupService.distributeStudentsByCourseAndDirection(courseNumber, directionId);
        return ResponseEntity.ok(groups);
    }

    // 2) Назначение куратора одной группе
    @PostMapping("/{groupId}/assign-curator")
    public ResponseEntity<GroupDTO> assignCuratorToGroup(
            @PathVariable Long groupId,
            @RequestParam Long curatorId) {
        GroupDTO updated = groupService.assignCuratorToGroup(groupId, curatorId);
        return ResponseEntity.ok(updated);
    }

    // 3) Массовое назначение куратора
    @PostMapping("/assign-curators")
    public ResponseEntity<List<GroupDTO>> assignCuratorsToGroups(
            @RequestBody List<GroupCuratorAssignDTO> assignments) {
        List<GroupDTO> result = groupService.assignCuratorsToGroups(assignments);
        return ResponseEntity.ok(result);
    }

    @Autowired
    public GroupController(GroupService groupService) {
        this.groupService = groupService;
    }

    @PostMapping
    public GroupDTO createGroup(@Valid @RequestBody GroupCreateDTO dto) {
        return groupService.saveGroup(dto);
    }

    @GetMapping("/{id}")
    public GroupDTO getGroupById(@PathVariable Long id) {
        return groupService.getGroupById(id)
                .orElseThrow(() -> new RuntimeException("Group not found"));
    }

    @DeleteMapping("/{id}")
    public void deleteGroup(@PathVariable Long id) {
        groupService.deleteGroupById(id);
    }

    @PutMapping("/{id}")
    public GroupDTO updateGroup(@PathVariable Long id, @Valid @RequestBody GroupCreateDTO dto) {
        return groupService.updateGroup(id, dto);
    }

    @GetMapping
    public List<GroupDTO> getAllGroups(
            @RequestParam(required = false) String search,
            @RequestParam(required = false, name = "directionName") String directionName) {
        return groupService.searchGroups(search, directionName);
    }



}
