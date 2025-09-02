package com.kkc_lms.controller;

import com.kkc_lms.dto.Regist.*;
import com.kkc_lms.entity.Course;
import com.kkc_lms.service.Registration.RegistrationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/registrations")
@RequiredArgsConstructor
public class RegistrationController {
    private final RegistrationService regService;

    // Превью: показать офферинги (предметы + компоненты + преподаватели) для указанного семестра/направления/курса/года
    @GetMapping("/preview")
    public ResponseEntity<List<SubjectWithComponentsDTO>> previewOfferings(
            @RequestParam Long semesterId,
            @RequestParam Long directionId,
            @RequestParam Course course,
            @RequestParam int year
    ) {
        return ResponseEntity.ok(regService.previewOfferings(semesterId, directionId, course, year));
    }

    // Админ: создать сессию и слоты на основе превью (если уже есть — вернуть существующую)
    @PostMapping("/sessions/create-from-preview")
    public ResponseEntity<RegistrationSessionDTO> createSessionFromPreview(
            @RequestParam Long semesterId,
            @RequestParam Long directionId,
            @RequestParam Course course,
            @RequestParam int year
    ) {
        RegistrationSessionDTO dto = regService.createSessionFromPreviewDTO(semesterId, directionId, course, year);
        return ResponseEntity.ok(dto);
    }

    // Админ: открыть сессию (делает её доступной для регистрации студентов)
    @PostMapping("/sessions/{id}/open")
    public ResponseEntity<RegistrationSessionDTO> openSession(@PathVariable Long id) {
        RegistrationSessionDTO dto = regService.openExistingSessionDTO(id);
        return ResponseEntity.ok(dto);
    }

    // Админ: закрыть сессию (закрывает доступ к регистрации в ней)
    @PostMapping("/sessions/{id}/close")
    public ResponseEntity<RegistrationSessionDTO> closeSession(@PathVariable Long id) {
        RegistrationSessionDTO dto = regService.closeExistingSessionDTO(id);
        return ResponseEntity.ok(dto);
    }

    // Админ: открыть отдельный слот в сессии (сделать конкретный предмет доступным)
    @PostMapping("/slots/{id}/open")
    public ResponseEntity<RegistrationSlotDTO> openSlot(@PathVariable Long id) {
        RegistrationSlotDTO dto = regService.setSlotOpenDTO(id, true);
        return ResponseEntity.ok(dto);
    }

    // Админ: закрыть отдельный слот (сделать недоступным)
    @PostMapping("/slots/{id}/close")
    public ResponseEntity<RegistrationSlotDTO> closeSlot(@PathVariable Long id) {
        RegistrationSlotDTO dto = regService.setSlotOpenDTO(id, false);
        return ResponseEntity.ok(dto);
    }

    // Студент: получить ВСЕ открытые слоты для своего направления/курса в указанном семестре и году,
    //         + в каждом слоте пометка registered/registrationId (если студент уже записан)
    @GetMapping("/slots/available")
    public ResponseEntity<List<RegistrationSlotDTO>> getAvailableSlotsForStudent(
            @RequestParam Long studentId,
            @RequestParam Long semesterId,
            @RequestParam int year
    ) {
        return ResponseEntity.ok(regService.getAvailableSlotsForStudentDTO(studentId, semesterId, year));
    }

    // Студент: зарегистрироваться на слот (slotId) — возвращает DTO созданной регистрации
    @PostMapping("/slots/{slotId}/register")
    public ResponseEntity<StudentSubjectRegistrationDTO> registerForSlot(
            @PathVariable Long slotId,
            @RequestParam Long studentId
    ) {
        StudentSubjectRegistrationDTO dto = regService.registerStudentDTO(slotId, studentId);
        return ResponseEntity.ok(dto);
    }

    // Студент: отменить регистрацию на слот (если сессия открыта) — возвращает обновлённую запись регистрации
    @PostMapping("/slots/{slotId}/cancel")
    public ResponseEntity<StudentSubjectRegistrationDTO> cancelRegistration(
            @PathVariable Long slotId,
            @RequestParam Long studentId
    ) {
        StudentSubjectRegistrationDTO dto = regService.cancelRegistrationDTO(slotId, studentId);
        return ResponseEntity.ok(dto);
    }

    // Админ/Coordinator: получить ВСЕ слоты для конкретной сессии (полный список, без фильтрации по студенту)
    @GetMapping("/sessions/{id}/slots")
    public ResponseEntity<List<RegistrationSlotDTO>> getSlotsForSession(@PathVariable Long id) {
        return ResponseEntity.ok(regService.getSlotsForSessionDTO(id));
    }

    // Админ/Coordinator: получить все записи регистраций для сессии (для отчёта/экспорта)
    @GetMapping("/sessions/{id}/registrations")
    public ResponseEntity<List<StudentSubjectRegistrationDTO>> getRegistrationsForSession(@PathVariable Long id) {
        return ResponseEntity.ok(regService.getRegistrationsForSessionDTO(id));
    }

    // Админ/Coordinator: получить список групп, связанных с данной сессией (через назначения или зарегистрированных студентов)
    @GetMapping("/sessions/{id}/groups")
    public ResponseEntity<List<GroupDTO>> getGroupsForSession(@PathVariable("id") Long sessionId) {
        return ResponseEntity.ok(regService.getGroupsForSession(sessionId));
    }

    // Админ/Coordinator: получить студентов указанной группы и их статусы по всем офферингам сессии.
    // Возвращает для каждого студента список офферингов с флагом registered и общим флагом registeredAll.
    @GetMapping("/sessions/{id}/groups/{groupId}/students")
    public ResponseEntity<GroupRegistrationsDTO> getGroupRegistrations(
            @PathVariable("id") Long sessionId,
            @PathVariable("groupId") Long groupId
    ) {
        return ResponseEntity.ok(regService.getGroupRegistrationsForSession(sessionId, groupId));
    }

}
