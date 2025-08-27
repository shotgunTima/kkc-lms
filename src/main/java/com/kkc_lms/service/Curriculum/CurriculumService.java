package com.kkc_lms.service.Curriculum;
import com.kkc_lms.entity.Course;
import com.kkc_lms.dto.ComponentDTO;
import com.kkc_lms.dto.CreateOfferingDTO;
import com.kkc_lms.dto.FilterDTO;
import com.kkc_lms.dto.User.AssignTeacherDTO;
import com.kkc_lms.entity.*;
import com.kkc_lms.entity.Module;
import com.kkc_lms.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CurriculumService {

    private final SubjectOfferingRepository offeringRepo;
    private final SubjectRepository subjectRepo;
    private final SemesterRepository semesterRepo;
    private final DirectionRepository directionRepo;
    private final ModuleRepository moduleRepo;
    private final SubjectComponentRepository componentRepo;
    private final TeacherRepository teacherRepo;
    private final GroupRepository groupRepo;
    private final GroupComponentAssignmentRepository assignmentRepo;

    // Получить все офферинги
    public List<SubjectOffering> getAllOfferings() {
        return offeringRepo.findAll();
    }

    // Получить офферинг по id
    public SubjectOffering getOfferingById(Long id) {
        return offeringRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Offering not found: " + id));
    }

    // Создание офферинга
    @Transactional
    public SubjectOffering createOffering(CreateOfferingDTO dto) {
        Subject subject = subjectRepo.findById(dto.getSubjectId())
                .orElseThrow(() -> new RuntimeException("Subject not found"));
        Semester semester = semesterRepo.findById(dto.getSemesterId())
                .orElseThrow(() -> new RuntimeException("Semester not found"));
        Direction direction = directionRepo.findById(dto.getDirectionId())
                .orElseThrow(() -> new RuntimeException("Direction not found"));

        Module module = null;
        if (dto.getModuleId() != null) {
            module = moduleRepo.findById(dto.getModuleId())
                    .orElseThrow(() -> new RuntimeException("Module not found"));
        }

        // парсим курс (твой enum имеет fromFlexible)
        Course course = Course.fromFlexible(dto.getCourse());

        SubjectOffering offering = new SubjectOffering();
        offering.setSubject(subject);
        offering.setSemester(semester);
        offering.setDirection(direction);
        offering.setModule(module);
        offering.setCourse(course);
        offering.setTotalHours(dto.getTotalHours());
        offering.setCapacity(dto.getCapacity());

        // Сначала сохраняем офферинг, чтобы получить id
        offering = offeringRepo.save(offering);

        // Создаём компоненты если были
        if (dto.getComponents() != null) {
            for (ComponentDTO cDto : dto.getComponents()) {
                SubjectComponent comp = new SubjectComponent();
                comp.setOffering(offering);
                comp.setType(cDto.getType());
                comp.setHours(cDto.getHours());
                componentRepo.save(comp);
            }
        }

        // Возвращаем офферинг с компонентами (они будут подтянуты при необходимости)
        return offeringRepo.findById(offering.getId()).orElse(offering);
    }

    // Обновление офферинга (частично)
    @Transactional
    public SubjectOffering updateOffering(Long id, CreateOfferingDTO dto) {
        SubjectOffering offering = offeringRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Offering not found"));

        if (dto.getTotalHours() != null) offering.setTotalHours(dto.getTotalHours());
        if (dto.getCapacity() != null) offering.setCapacity(dto.getCapacity());
        if (dto.getCourse() != null) offering.setCourse(Course.fromFlexible(dto.getCourse()));

        return offeringRepo.save(offering);
    }

    // Удаление
    @Transactional
    public void deleteOffering(Long id) {
        offeringRepo.deleteById(id);
    }

    // По семестру
    public List<SubjectOffering> getOfferingsBySemester(Long semesterId) {
        Semester sem = semesterRepo.findById(semesterId)
                .orElseThrow(() -> new RuntimeException("Semester not found"));
        return offeringRepo.findBySemester(sem);
    }

    // По семестр+направление+курс (эффективный путь)
    public List<SubjectOffering> getOfferingsForCurriculum(Long semesterId, Long directionId, Course course) {
        return offeringRepo.findBySemesterIdAndDirectionIdAndCourse(semesterId, directionId, course);
    }

    // Гибкий фильтр (принимает FilterDTO)
    public List<SubjectOffering> filterOfferings(FilterDTO filter) {
        if (filter == null) return Collections.emptyList();

        Long semesterId = filter.getSemesterId();
        Long directionId = filter.getDirectionId();
        String courseStr = filter.getCourse();

        // безопасный, final парсер курса (из твоего enum Course)
        final Course parsedCourse = (courseStr != null && !courseStr.isBlank())
                ? Course.fromFlexible(courseStr)
                : null;

        // Быстрый путь — все три параметра заданы
        if (semesterId != null && directionId != null && parsedCourse != null) {
            return offeringRepo.findBySemesterIdAndDirectionIdAndCourse(semesterId, directionId, parsedCourse);
        }

        // Fallback: фильтруем в памяти (неоптимально для больших наборов — для тестов ок)
        List<SubjectOffering> all = offeringRepo.findAll();
        return all.stream()
                .filter(o -> semesterId == null || (o.getSemester() != null && semesterId.equals(o.getSemester().getId())))
                .filter(o -> directionId == null || (o.getDirection() != null && directionId.equals(o.getDirection().getId())))
                // используем parsedCourse (final) — избегаем конфликтов имён
                .filter(o -> parsedCourse == null || (o.getCourse() != null && o.getCourse().equals(parsedCourse)))
                .collect(Collectors.toList());
    }

    /**
     * Назначение преподавателя на конкретный компонент для конкретной группы.
     * Возвращает офферинг, к которому принадлежит компонент (с актуальными назначениями).
     */
    @Transactional
    public SubjectOffering assignTeacherToComponent(AssignTeacherDTO dto) {
        SubjectComponent component = componentRepo.findById(dto.getComponentId())
                .orElseThrow(() -> new RuntimeException("Component not found"));
        Teacher teacher = teacherRepo.findById(dto.getTeacherId())
                .orElseThrow(() -> new RuntimeException("Teacher not found"));
        Group group = groupRepo.findById(dto.getGroupId())
                .orElseThrow(() -> new RuntimeException("Group not found"));

        GroupComponentAssignment assign = new GroupComponentAssignment();
        assign.setComponent(component);
        assign.setTeacher(teacher);
        assign.setGroup(group);

        assignmentRepo.save(assign);

        // возвращаем офферинг (связанная сущность)
        return offeringRepo.findById(component.getOffering().getId())
                .orElseThrow(() -> new RuntimeException("Offering not found after assignment"));
    }
}
