package com.kkc_lms.controller;

import com.kkc_lms.dto.*;
import com.kkc_lms.dto.User.AssignTeacherDTO;
import com.kkc_lms.entity.Course;
import com.kkc_lms.entity.SubjectOffering;
import com.kkc_lms.service.Curriculum.CurriculumService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/curriculum")
@RequiredArgsConstructor
public class CurriculumController {

    private final CurriculumService curriculumService;

    // GET /curriculum/offerings -> список OfferingDTO
    @GetMapping("/offerings")
    public List<OfferingDTO> getAllOfferings() {
        return curriculumService.getAllOfferings().stream()
                .map(SubjectOffering::toDto)
                .toList();
    }

    // GET /curriculum/offerings/{id} -> OfferingWithAssignmentsDTO
    @GetMapping("/offerings/{id}")
    public OfferingWithAssignmentsDTO getOffering(@PathVariable Long id) {
        SubjectOffering offering = curriculumService.getOfferingById(id);
        return offering.toWithAssignmentsDto();
    }

    // POST /curriculum/offerings -> create
    @PostMapping("/offerings")
    public OfferingDTO createOffering(@RequestBody CreateOfferingDTO dto) {
        SubjectOffering offering = curriculumService.createOffering(dto);
        return offering.toDto();
    }

    // PUT /curriculum/offerings/{id} -> update (partial)
    @PutMapping("/offerings/{id}")
    public OfferingDTO updateOffering(@PathVariable Long id, @RequestBody CreateOfferingDTO dto) {
        SubjectOffering offering = curriculumService.updateOffering(id, dto);
        return offering.toDto();
    }

    // DELETE /curriculum/offerings/{id}
    @DeleteMapping("/offerings/{id}")
    public ResponseEntity<Void> deleteOffering(@PathVariable Long id) {
        curriculumService.deleteOffering(id);
        return ResponseEntity.noContent().build();
    }

    // GET /curriculum/semester/{semesterId} -> all offerings in semester
    @GetMapping("/semester/{semesterId}")
    public List<OfferingDTO> getBySemester(@PathVariable Long semesterId) {
        return curriculumService.getOfferingsBySemester(semesterId).stream()
                .map(SubjectOffering::toDto)
                .toList();
    }

    /**
     * GET /curriculum/search?semesterId=..&directionId=..&course=..
     * Fast path when all three params present (calls repository query).
     * Otherwise falls back to filterOfferings (in-memory filter).
     */
    @GetMapping("/search")
    public List<OfferingDTO> searchOfferings(
            @RequestParam(required = false) Long semesterId,
            @RequestParam(required = false) Long directionId,
            @RequestParam(required = false) String course
    ) {
        if (semesterId != null && directionId != null && course != null && !course.isBlank()) {
            Course parsed = Course.fromFlexible(course);
            return curriculumService.getOfferingsForCurriculum(semesterId, directionId, parsed).stream()
                    .map(SubjectOffering::toDto)
                    .toList();
        }

        // fallback -> use FilterDTO and filterOfferings
        FilterDTO filter = new FilterDTO();
        filter.setSemesterId(semesterId);
        filter.setDirectionId(directionId);
        filter.setCourse(course);
        return curriculumService.filterOfferings(filter).stream()
                .map(SubjectOffering::toDto)
                .toList();
    }

    // POST /curriculum/offerings/filter -> flexible filter by body
    @PostMapping("/offerings/filter")
    public List<OfferingDTO> filterOfferings(@RequestBody FilterDTO filter) {
        return curriculumService.filterOfferings(filter).stream()
                .map(SubjectOffering::toDto)
                .toList();
    }

    // POST /curriculum/assign-teacher -> assign teacher to component+group
    @PostMapping("/assign-teacher")
    public OfferingWithAssignmentsDTO assignTeacher(@RequestBody AssignTeacherDTO dto) {
        SubjectOffering offering = curriculumService.assignTeacherToComponent(dto);
        return offering.toWithAssignmentsDto();
    }
}
