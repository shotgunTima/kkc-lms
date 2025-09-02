package com.kkc_lms.service.Registration;

import com.kkc_lms.dto.Regist.*;
import com.kkc_lms.entity.*;
import com.kkc_lms.repository.*;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RegistrationService {
    private final RegistrationSessionRepository sessionRepo;
    private final RegistrationSlotRepository slotRepo;
    private final SubjectOfferingRepository offeringRepo;
    private final StudentSubjectRegistrationRepository regRepo;
    private final SemesterRepository semesterRepo;
    private final DirectionRepository directionRepo;
    private final StudentRepository studentRepo;

    @Transactional(readOnly = true)
    public List<SubjectWithComponentsDTO> previewOfferings(Long semesterId, Long directionId, Course course, int year) {
        Semester sem = semesterRepo.findById(semesterId)
                .orElseThrow(() -> new EntityNotFoundException("Semester not found: " + semesterId));

        if (sem.getYear() != year) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Semester " + semesterId + " has year " + sem.getYear() + ", but request year was " + year);
        }

        // Получаем офферинги (подгружаем components через репозиторий)
        List<SubjectOffering> offerings = offeringRepo
                .findBySemesterIdAndDirectionIdAndCourseWithComponents(semesterId, directionId, course);

        Map<Long, SubjectWithComponentsDTO> map = new LinkedHashMap<>();
        for (SubjectOffering off : offerings) {
            if (off.getSubject() == null) continue;
            Subject s = off.getSubject();
            Long subjectId = s.getId();

            SubjectWithComponentsDTO dto = map.computeIfAbsent(subjectId, id ->
                    new SubjectWithComponentsDTO(subjectId, s.getCode(), s.getName(), s.getCredits(), new ArrayList<>(), new ArrayList<>())
            );

            // компоненты офферинга
            if (off.getComponents() != null) {
                for (SubjectComponent comp : off.getComponents()) {
                    dto.getComponents().add(new ComponentSimpleDTO(comp.getId(), comp.getType(), comp.getHours()));
                }
            }

            // преподаватели берем из Subject (у тебя Set<Teacher> teachers)
            if (s.getTeachers() != null) {
                for (Teacher t : s.getTeachers()) {
                    if (t == null) continue;
                    Long tid = t.getId();

                    // получаем полное имя через связанный User.fullname
                    String fullName = null;
                    if (t.getUser() != null && t.getUser().getFullname() != null && !t.getUser().getFullname().isBlank()) {
                        fullName = t.getUser().getFullname();
                    } else {
                        fullName = "Teacher#" + tid; // fallback
                    }

                    boolean exists = dto.getTeachers().stream().anyMatch(x -> x.getId().equals(tid));
                    if (!exists) {
                        dto.getTeachers().add(new TeacherSimpleDTO(tid, fullName));
                    }
                }
            }
        }

        return new ArrayList<>(map.values());
    }

    /**
     * Админ: создать RegistrationSession и слоты на основе превью офферингов.
     * Возвращает созданную (или существующую) сессию.
     */
    @Transactional
    public RegistrationSession createSessionFromPreview(Long semesterId, Long directionId, Course course, int year) {
        Semester sem = semesterRepo.findById(semesterId)
                .orElseThrow(() -> new EntityNotFoundException("Semester not found: " + semesterId));

        if (sem.getYear() != year) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Semester year mismatch");
        }

        Direction direction = directionRepo.findById(directionId)
                .orElseThrow(() -> new EntityNotFoundException("Direction not found: " + directionId));

        // ищем существующую сессию по semester+direction+course+year
        Optional<RegistrationSession> existing = sessionRepo.findBySemesterAndDirectionAndCourseAndYear(sem, direction, course, year);
        RegistrationSession session = existing.orElseGet(() -> {
            RegistrationSession s = new RegistrationSession();
            s.setSemester(sem);
            s.setDirection(direction);
            s.setCourse(course);
            s.setYear(year);
            s.setOpen(false); // по умолчанию закрыта — админ откроет позже
            return sessionRepo.save(s);
        });

        // используем существующий репозиторный метод, который подгружает components (и subject)
        List<SubjectOffering> offerings = offeringRepo
                .findBySemesterIdAndDirectionIdAndCourseWithComponents(semesterId, directionId, course);

        // Создаём слоты для каждого офферинга; уникальный constraint не даст дублировать, но лучше проверять в памяти
        for (SubjectOffering off : offerings) {
            if (off == null) continue;
            boolean existsSlot = session.getSlots() != null && session.getSlots().stream()
                    .anyMatch(sl -> sl.getOffering() != null && sl.getOffering().getId().equals(off.getId()));
            if (!existsSlot) {
                RegistrationSlot slot = new RegistrationSlot();
                slot.setSession(session);
                slot.setOffering(off);
                slot.setOpen(false); // по-умолчанию закрыт, админ откроет
                session.getSlots().add(slot);
            }
        }

        return sessionRepo.save(session);
    }


    /**
     * Админ: открыть уже созданную сессию регистрации (включает session.open и все слоты)
     */
    @Transactional
    public RegistrationSession openExistingSession(Long sessionId) {
        RegistrationSession session = sessionRepo.findById(sessionId)
                .orElseThrow(() -> new EntityNotFoundException("RegistrationSession not found: " + sessionId));

        if (session.isOpen()) return session; // уже открыт

        session.setOpen(true);
        if (session.getOpenedAt() == null) {
            session.setOpenedAt(LocalDateTime.now());
        }

        // опционально: открыть все слоты в этой сессии
        if (session.getSlots() != null) {
            session.getSlots().forEach(slot -> slot.setOpen(true));
        }

        return sessionRepo.save(session);
    }

    /**
     * Админ: закрыть сессию регистрации (закрывает session.open и все слоты)
     */
    @Transactional
    public RegistrationSession closeExistingSession(Long sessionId) {
        RegistrationSession session = sessionRepo.findById(sessionId)
                .orElseThrow(() -> new EntityNotFoundException("RegistrationSession not found: " + sessionId));

        if (!session.isOpen()) return session; // уже закрыта

        session.setOpen(false);
        if (session.getSlots() != null) {
            session.getSlots().forEach(slot -> slot.setOpen(false));
        }

        return sessionRepo.save(session);
    }

    /**
     * Админ: установить флажок open для отдельного слота
     */
    @Transactional
    public RegistrationSlot setSlotOpen(Long slotId, boolean open) {
        RegistrationSlot slot = slotRepo.findById(slotId)
                .orElseThrow(() -> new EntityNotFoundException("RegistrationSlot not found: " + slotId));

        slot.setOpen(open);
        return slotRepo.save(slot);
    }


    /**
     * Студент: зарегистрироваться на слот
     */
    @Transactional
    public StudentSubjectRegistration registerStudent(Long slotId, Long studentId) {
        RegistrationSlot slot = slotRepo.findById(slotId)
                .orElseThrow(() -> new EntityNotFoundException("Slot not found: " + slotId));
        RegistrationSession session = slot.getSession();
        if (session == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Session for slot not found");

        if (!session.isOpen() || !slot.isOpen()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Registration is closed for this session/slot");
        }

        Student student = studentRepo.findById(studentId)
                .orElseThrow(() -> new EntityNotFoundException("Student not found: " + studentId));

        // проверка дублей
        Optional<StudentSubjectRegistration> exist = regRepo.findByStudentAndSlot(student, slot);
        if (exist.isPresent()) {
            StudentSubjectRegistration r = exist.get();
            if (!r.isActive()) {
                r.setActive(true);
                r.setRegisteredAt(LocalDateTime.now());
                r.setCanceledAt(null);
                return regRepo.save(r);
            }
            return r; // уже зарегистрирован
        }

        // опциональная проверка capacity (если capacity задан)
        SubjectOffering offering = slot.getOffering();
        Integer capacity = offering != null ? offering.getCapacity() : null;
        if (capacity != null) {
            long activeCount = regRepo.countBySlotAndActiveTrue(slot);
            if (activeCount >= capacity) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Slot capacity exceeded");
            }
        }

        StudentSubjectRegistration reg = new StudentSubjectRegistration();
        reg.setSlot(slot);
        reg.setStudent(student);
        reg.setActive(true);
        reg.setRegisteredAt(LocalDateTime.now());
        return regRepo.save(reg);
    }

    /**
     * Студент: отменить регистрацию (флажок active = false)
     */
    @Transactional
    public StudentSubjectRegistration cancelRegistration(Long slotId, Long studentId) {
        RegistrationSlot slot = slotRepo.findById(slotId)
                .orElseThrow(() -> new EntityNotFoundException("Slot not found: " + slotId));
        RegistrationSession session = slot.getSession();
        if (session == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Session for slot not found");

        if (!session.isOpen()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Cannot cancel: registration closed for this session");
        }

        Student student = studentRepo.findById(studentId)
                .orElseThrow(() -> new EntityNotFoundException("Student not found: " + studentId));

        StudentSubjectRegistration exist = regRepo.findByStudentAndSlot(student, slot)
                .orElseThrow(() -> new EntityNotFoundException("Registration not found for student " + studentId + " and slot " + slotId));

        if (!exist.isActive()) {
            return exist; // уже отменен
        }

        exist.setActive(false);
        exist.setCanceledAt(LocalDateTime.now());
        return regRepo.save(exist);
    }

    /**
     * Отчёт: кто зарегистрирован для заданной сессии
     */
    @Transactional(readOnly = true)
    public List<StudentSubjectRegistration> getRegistrationsForSession(Long sessionId) {
        return regRepo.findBySlot_SessionId(sessionId);
    }

    @Transactional(readOnly = true)
    public List<RegistrationSlot> getSlotsForSession(Long sessionId) {
        RegistrationSession session = sessionRepo.findById(sessionId)
                .orElseThrow(() -> new EntityNotFoundException("Session not found: " + sessionId));
        return slotRepo.findBySession(session);
    }

    @Transactional(readOnly = true)
    public List<StudentSubjectRegistration> getRegistrationsForSessionForStudent(Long sessionId, Long studentId) {
        studentRepo.findById(studentId).orElseThrow(() -> new EntityNotFoundException("Student not found: " + studentId));
        return regRepo.findBySlot_SessionIdAndStudent_Id(sessionId, studentId);
    }

    @Transactional(readOnly = true)
    public Optional<StudentSubjectRegistration> getRegistrationForStudentAndSlot(Long studentId, Long slotId) {
        return regRepo.findByStudent_IdAndSlot_Id(studentId, slotId);
    }


    @Transactional(readOnly = true)
    public List<RegistrationSlot> getAvailableSlotsForStudent(Long studentId, Long semesterId) {
        Student student = studentRepo.findById(studentId)
                .orElseThrow(() -> new EntityNotFoundException("Student not found: " + studentId));

        Semester semester = semesterRepo.findById(semesterId)
                .orElseThrow(() -> new EntityNotFoundException("Semester not found: " + semesterId));

        // Находим сессии для этого семестра/направления/курса, которые открыты
        List<RegistrationSession> sessions = sessionRepo.findBySemesterAndDirectionAndCourse(semester, student.getDirection(), student.getCourse());

        // Оставляем только открытые сессии
        List<RegistrationSession> openSessions = sessions.stream()
                .filter(RegistrationSession::isOpen)
                .toList();

        if (openSessions.isEmpty()) return List.of();

        List<RegistrationSlot> allSlots = slotRepo.findBySessionIn(openSessions);

        // фильтруем только открытые слоты
        allSlots = allSlots.stream().filter(RegistrationSlot::isOpen).toList();

        // исключаем предметы, на которые студент уже зарегистрирован (active)
        List<StudentSubjectRegistration> existingRegs = regRepo.findByStudent_IdAndSlot_SessionIn(studentId, openSessions);

        List<Long> registeredSlotIds = existingRegs.stream()
                .filter(StudentSubjectRegistration::isActive)
                .map(reg -> reg.getSlot().getId())
                .toList();

        return allSlots.stream()
                .filter(slot -> !registeredSlotIds.contains(slot.getId()))
                .toList();
    }
    @Transactional
    public RegistrationSessionDTO createSessionFromPreviewDTO(Long semesterId, Long directionId, Course course, int year) {
        RegistrationSession session = createSessionFromPreview(semesterId, directionId, course, year);
        // Подгружаем сессию с слотами и офферами (предпочтительно fetch-join репозиторием)
        RegistrationSession loaded = sessionRepo.findWithSlotsAndOfferingsById(session.getId())
                .orElse(session); // fallback если метод не реализован
        return toSessionDTO(loaded);
    }

    @Transactional
    public RegistrationSessionDTO openExistingSessionDTO(Long sessionId) {
        RegistrationSession session = openExistingSession(sessionId);
        RegistrationSession loaded = sessionRepo.findWithSlotsAndOfferingsById(session.getId())
                .orElse(session);
        return toSessionDTO(loaded);
    }

    @Transactional
    public RegistrationSessionDTO closeExistingSessionDTO(Long sessionId) {
        RegistrationSession session = closeExistingSession(sessionId);
        RegistrationSession loaded = sessionRepo.findWithSlotsAndOfferingsById(session.getId())
                .orElse(session);
        return toSessionDTO(loaded);
    }

    @Transactional
    public RegistrationSlotDTO setSlotOpenDTO(Long slotId, boolean open) {
        RegistrationSlot slot = setSlotOpen(slotId, open);
        // если нужно подгрузить offering -> subject:
        RegistrationSlot loaded = slotRepo.findWithOfferingAndSubjectById(slot.getId()).orElse(slot);
        return toSlotDTO(loaded);
    }

    @Transactional
    public StudentSubjectRegistrationDTO registerStudentDTO(Long slotId, Long studentId) {
        StudentSubjectRegistration reg = registerStudent(slotId, studentId);
        // подгружаем нужные связи через репозиторий, если нужно
        StudentSubjectRegistration loaded = regRepo.findByIdWithSlotAndStudent(reg.getId()).orElse(reg);
        return toRegistrationDTO(loaded);
    }

    @Transactional
    public StudentSubjectRegistrationDTO cancelRegistrationDTO(Long slotId, Long studentId) {
        StudentSubjectRegistration reg = cancelRegistration(slotId, studentId);
        StudentSubjectRegistration loaded = regRepo.findByIdWithSlotAndStudent(reg.getId()).orElse(reg);
        return toRegistrationDTO(loaded);
    }

    @Transactional(readOnly = true)
    public List<RegistrationSlotDTO> getSlotsForSessionDTO(Long sessionId) {
        // подгрузим session с слотами
        RegistrationSession session = sessionRepo.findWithSlotsAndOfferingsById(sessionId)
                .orElseThrow(() -> new EntityNotFoundException("Session not found: " + sessionId));
        return session.getSlots().stream().map(this::toSlotDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<StudentSubjectRegistrationDTO> getRegistrationsForSessionDTO(Long sessionId) {
        List<StudentSubjectRegistration> regs = getRegistrationsForSession(sessionId);
        return regs.stream().map(this::toRegistrationDTO).collect(Collectors.toList());
    }

    /**
     * Возвращает ВСЕ открытые слоты для студента по semesterId и year,
     * и помечает те слоты, на которые студент уже зарегистрирован (registered=true).
     */
    @Transactional(readOnly = true)
    public List<RegistrationSlotDTO> getAvailableSlotsForStudentDTO(Long studentId, Long semesterId, int year) {
        // Валидация студента
        Student student = studentRepo.findById(studentId)
                .orElseThrow(() -> new EntityNotFoundException("Student not found: " + studentId));

        // Валидация семестра и совпадение года
        Semester semester = semesterRepo.findById(semesterId)
                .orElseThrow(() -> new EntityNotFoundException("Semester not found: " + semesterId));

        if (semester.getYear() != year) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Semester " + semesterId + " has year " + semester.getYear() + " but request year was " + year);
        }

        // Находим сессии для этого семестра/направления/курса
        List<RegistrationSession> sessions = sessionRepo.findBySemesterAndDirectionAndCourse(semester, student.getDirection(), student.getCourse());

        // Оставляем только открытые сессии
        List<RegistrationSession> openSessions = sessions.stream()
                .filter(RegistrationSession::isOpen)
                .collect(Collectors.toList());

        if (openSessions.isEmpty()) return List.of();

        // Подгружаем все слоты для этих сессий
        List<RegistrationSlot> allSlots = slotRepo.findBySessionIn(openSessions).stream()
                .filter(RegistrationSlot::isOpen) // только открытые слоты
                .collect(Collectors.toList());

        if (allSlots.isEmpty()) return List.of();

        // Получаем активные регистрации студента в этих сессиях (если есть)
        List<StudentSubjectRegistration> existingRegs = regRepo.findByStudent_IdAndSlot_SessionIn(studentId, openSessions);

        // Сопоставляем по slotId -> регистрация
        Map<Long, StudentSubjectRegistration> regBySlot = existingRegs.stream()
                .filter(StudentSubjectRegistration::isActive)
                .filter(r -> r.getSlot() != null && r.getSlot().getId() != null)
                .collect(Collectors.toMap(r -> r.getSlot().getId(), r -> r, (a,b) -> a)); // в случае дубликатов оставляем первый

        // Маппим все слоты в DTO и ставим флаг registered, registrationId если есть
        return allSlots.stream().map(slot -> {
            RegistrationSlotDTO dto = toSlotDTO(slot);
            StudentSubjectRegistration reg = regBySlot.get(slot.getId());
            if (reg != null) {
                dto.setRegistered(true);
                dto.setRegistrationId(reg.getId());
            } else {
                dto.setRegistered(false);
                dto.setRegistrationId(null);
            }
            return dto;
        }).collect(Collectors.toList());
    }

    // ------------------ Мапперы ------------------

    private RegistrationSlotDTO toSlotDTO(RegistrationSlot slot) {
        if (slot == null) return null;
        RegistrationSlotDTO dto = new RegistrationSlotDTO();
        dto.setId(slot.getId());
        dto.setOpen(slot.isOpen());
        if (slot.getOffering() != null) {
            SubjectOffering off = slot.getOffering();
            dto.setOfferingId(off.getId());
            if (off.getSubject() != null) {
                dto.setOfferingCode(off.getSubject().getCode());
                dto.setOfferingName(off.getSubject().getName());
            }
            dto.setCapacity(off.getCapacity());
        }
        return dto;
    }

    private RegistrationSessionDTO toSessionDTO(RegistrationSession session) {
        if (session == null) return null;
        RegistrationSessionDTO dto = new RegistrationSessionDTO();
        dto.setId(session.getId());
        dto.setSemesterId(session.getSemester() != null ? session.getSemester().getId() : null);
        dto.setSemesterName(session.getSemester() != null ? session.getSemester().getName() : null);
        dto.setDirectionId(session.getDirection() != null ? session.getDirection().getId() : null);
        dto.setDirectionName(session.getDirection() != null ? session.getDirection().getName() : null);
        dto.setCourse(session.getCourse() != null ? session.getCourse().name() : null);
        dto.setYear(session.getYear() != null ? session.getYear() : 0);
        dto.setOpen(session.isOpen());
        dto.setOpenedAt(session.getOpenedAt());
        if (session.getSlots() != null) {
            dto.setSlots(session.getSlots().stream().map(this::toSlotDTO).collect(Collectors.toList()));
        }
        return dto;
    }

    private StudentSubjectRegistrationDTO toRegistrationDTO(StudentSubjectRegistration reg) {
        if (reg == null) return null;
        StudentSubjectRegistrationDTO dto = new StudentSubjectRegistrationDTO();
        dto.setId(reg.getId());
        dto.setActive(reg.isActive());
        dto.setRegisteredAt(reg.getRegisteredAt());
        dto.setCanceledAt(reg.getCanceledAt());
        if (reg.getStudent() != null) {
            dto.setStudentId(reg.getStudent().getId());
            dto.setStudentFullName(reg.getStudent().getUser() != null ? reg.getStudent().getUser().getFullname() : null);
        }
        if (reg.getSlot() != null) {
            dto.setSlotId(reg.getSlot().getId());
            if (reg.getSlot().getOffering() != null) dto.setOfferingId(reg.getSlot().getOffering().getId());
        }
        return dto;
    }
    // импортируй DTO'шки и др. в начале класса (у тебя уже есть импорты)
    @Transactional(readOnly = true)
    public List<GroupDTO> getGroupsForSession(Long sessionId) {
        RegistrationSession session = sessionRepo.findWithSlotsAndOfferingsById(sessionId)
                .orElseThrow(() -> new EntityNotFoundException("Session not found: " + sessionId));

        // Собираем группы из assignments в компонентах офферингов (если есть)
        Set<Group> groups = new HashSet<>();
        if (session.getSlots() != null) {
            for (RegistrationSlot slot : session.getSlots()) {
                SubjectOffering off = slot.getOffering();
                if (off == null) continue;
                if (off.getComponents() == null) continue;
                for (SubjectComponent comp : off.getComponents()) {
                    if (comp.getAssignments() == null) continue;
                    for (GroupComponentAssignment a : comp.getAssignments()) {
                        if (a.getGroup() != null) groups.add(a.getGroup());
                    }
                }
            }
        }

        // Если групп через assignments нет — можно также взять группы студентов, зарегистрированных в сессии
        if (groups.isEmpty()) {
            List<StudentSubjectRegistration> regs = regRepo.findBySlot_SessionId(sessionId);
            for (StudentSubjectRegistration r : regs) {
                if (r.getStudent() != null && r.getStudent().getGroup() != null) {
                    groups.add(r.getStudent().getGroup());
                }
            }
        }

        return groups.stream()
                .map(g -> new GroupDTO(g.getId(), g.getName()))
                .sorted(Comparator.comparing(GroupDTO::getName))
                .collect(Collectors.toList());
    }
    @Transactional(readOnly = true)
    public GroupRegistrationsDTO getGroupRegistrationsForSession(Long sessionId, Long groupId) {
        // подгружаем сессию с офферингами
        RegistrationSession session = sessionRepo.findWithSlotsAndOfferingsById(sessionId)
                .orElseThrow(() -> new EntityNotFoundException("Session not found: " + sessionId));

        // список офферингов (уникальный) для этой сессии
        List<SubjectOffering> offerings = session.getSlots().stream()
                .map(RegistrationSlot::getOffering)
                .filter(Objects::nonNull)
                .distinct()
                .collect(Collectors.toList());

        // если офферингов нет — вернём пустой ответ
        if (offerings.isEmpty()) {
            return new GroupRegistrationsDTO(groupId, null, List.of());
        }

        // подготовим базовые данные по офферингам (для маппинга)
        List<Long> offeringIds = offerings.stream().map(SubjectOffering::getId).collect(Collectors.toList());

        // Получаем список студентов указанной группы
        List<Student> students = studentRepo.findByGroup_Id(groupId);
        if (students == null || students.isEmpty()) {
            // пустая группа — вернём пустой список студентов
            // Попробуй получить имя группы (если нужно), иначе null
            String groupName = null;
            if (!students.isEmpty() && students.get(0).getGroup() != null) groupName = students.get(0).getGroup().getName();
            return new GroupRegistrationsDTO(groupId, groupName, List.of());
        }

        // Для каждого студента берем его регистрации в данной сессии
        List<StudentRegistrationSummaryDTO> studentSummaries = new ArrayList<>(students.size());

        for (Student st : students) {
            List<StudentSubjectRegistration> regs = regRepo.findBySlot_SessionIdAndStudent_Id(sessionId, st.getId());

            // создаём карту offeringId -> registration (активная)
            Map<Long, StudentSubjectRegistration> regByOffering = regs.stream()
                    .filter(StudentSubjectRegistration::isActive)
                    .filter(r -> r.getSlot() != null && r.getSlot().getOffering() != null)
                    .collect(Collectors.toMap(r -> r.getSlot().getOffering().getId(), r -> r, (a,b) -> a));

            // формируем список OfferingRegistrationDTO
            List<OfferingRegistrationDTO> offeringRegs = new ArrayList<>(offerings.size());
            for (SubjectOffering off : offerings) {
                Long offId = off.getId();
                StudentSubjectRegistration reg = regByOffering.get(offId);
                OfferingRegistrationDTO ordto = new OfferingRegistrationDTO();
                ordto.setOfferingId(offId);
                ordto.setOfferingCode(off.getSubject() != null ? off.getSubject().getCode() : null);
                ordto.setOfferingName(off.getSubject() != null ? off.getSubject().getName() : null);
                ordto.setRegistered(reg != null);
                ordto.setRegistrationId(reg != null ? reg.getId() : null);
                offeringRegs.add(ordto);
            }

            boolean registeredAll = offeringRegs.stream().allMatch(OfferingRegistrationDTO::isRegistered);

            StudentRegistrationSummaryDTO ssd = new StudentRegistrationSummaryDTO();
            ssd.setStudentId(st.getId());
            ssd.setStudentFullName(st.getUser() != null ? st.getUser().getFullname() : null);
            ssd.setOfferings(offeringRegs);
            ssd.setRegisteredAll(registeredAll);

            studentSummaries.add(ssd);
        }

        // попробуем получить имя группы (если есть)
        String groupName = null;
        if (!students.isEmpty() && students.get(0).getGroup() != null) groupName = students.get(0).getGroup().getName();

        return new GroupRegistrationsDTO(groupId, groupName, studentSummaries);
    }


}
