package com.kkc_lms.service.Group;

import com.kkc_lms.dto.Group.GroupCreateDTO;
import com.kkc_lms.dto.Group.GroupDTO;
import com.kkc_lms.dto.Student.StudentDTO;
import com.kkc_lms.entity.Course;
import com.kkc_lms.entity.Direction;
import com.kkc_lms.entity.Group;
import com.kkc_lms.entity.Student;
import com.kkc_lms.entity.Teacher;
import com.kkc_lms.repository.DirectionRepository;
import com.kkc_lms.repository.GroupRepository;
import com.kkc_lms.repository.StudentRepository;
import com.kkc_lms.repository.TeacherRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
public class GroupServiceImpl implements GroupService {

    private final GroupRepository groupRepository;
    private final TeacherRepository teacherRepository;
    private final DirectionRepository directionRepository;
    private final StudentRepository studentRepository;

    private static final int MAX_PER_GROUP = 20;

    /**
     * Перевести одного студента в другую (параллельную) группу.
     *
     * @param studentId     id студента
     * @param targetGroupId id целевой группы
     * @param force         если true — игнорировать проверки направления и заполненности
     * @return актуальный StudentDTO
     */
    @Transactional
    public StudentDTO transferStudentToGroup(Long studentId, Long targetGroupId, boolean force) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new EntityNotFoundException("Студент не найден: " + studentId));

        Group target = groupRepository.findById(targetGroupId)
                .orElseThrow(() -> new EntityNotFoundException("Целевая группа не найдена: " + targetGroupId));

        Group oldGroup = student.getGroup();

        // Проверки направления (если не force)
        if (!force) {
            if (student.getDirection() == null || target.getDirection() == null) {
                throw new IllegalArgumentException("У студента или у целевой группы не задано направление.");
            }
            if (!Objects.equals(student.getDirection().getId(), target.getDirection().getId())) {
                throw new IllegalArgumentException("Невозможно перевести: направление студента и целевой группы не совпадают.");
            }
        }

        // Проверка заполненности целевой группы (если не force)
        long targetSize = studentRepository.countByGroupId(targetGroupId);
        if (!force && targetSize >= MAX_PER_GROUP) {
            throw new IllegalStateException("Невозможно перевести: целевая группа заполнена (макс " + MAX_PER_GROUP + ").");
        }

        // Выполняем перевод
        student.setGroup(target);
        Student savedStudent = studentRepository.save(student);

        // Обновляем счётчики studentCount в группах, если такое поле предусмотрено
        // Проверяем и корректно обновляем только если поле не null
        if (oldGroup != null) {
            // защита: если поле studentCount доступно, уменьшаем на 1, но не ниже 0
            try {
                Integer oldCount = oldGroup.getStudentCount();
                if (oldCount == null) oldCount = 0;
                oldGroup.setStudentCount(Math.max(0, oldCount - 1));
                groupRepository.save(oldGroup);
            } catch (Throwable ignored) {
                // если у Group нет поля studentCount или геттер/сеттер другой — игнорируем
            }
        }

        try {
            Integer newCount = target.getStudentCount();
            if (newCount == null) newCount = 0;
            target.setStudentCount(newCount + 1);
            groupRepository.save(target);
        } catch (Throwable ignored) {
            // игнорируем, если поле отсутствует
        }

        return mapStudentToDTO(savedStudent);
    }

    // Вспомогательный метод для маппинга Student -> StudentDTO (локальная версия)
    private StudentDTO mapStudentToDTO(Student student) {
        StudentDTO dto = new StudentDTO();
        dto.setId(student.getId());
        if (student.getUser() != null) {
            dto.setUserId(student.getUser().getId());
            dto.setUsername(student.getUser().getUsername());
        }
        dto.setStudentIdNumber(student.getStudentIdNumber());
        dto.setTotalCredits(student.getTotalCredits());
        dto.setAdmissionYear(student.getAdmissionYear());
        dto.setCourse(student.getCourse());

        if (student.getDirection() != null) {
            dto.setDirectionId(student.getDirection().getId());
            dto.setDirectionName(student.getDirection().getName());
        }
        if (student.getGroup() != null) {
            dto.setGroupId(student.getGroup().getId());
            dto.setGroupName(student.getGroup().getName());
        }
        return dto;
    }
    @Transactional
    public GroupDTO assignCuratorToGroup(Long groupId, Long curatorId) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new EntityNotFoundException("Группа не найдена: " + groupId));

        Teacher curator = teacherRepository.findById(curatorId)
                .orElseThrow(() -> new EntityNotFoundException("Куратор не найден: " + curatorId));

        group.setCurator(curator);
        Group saved = groupRepository.save(group);
        return mapToDTO(saved);
    }

    @Transactional
    public List<GroupDTO> assignCuratorsToGroups(List<com.kkc_lms.dto.Group.GroupCuratorAssignDTO> assignments) {
        if (assignments == null || assignments.isEmpty()) return Collections.emptyList();

        List<Group> groupsToSave = new ArrayList<>(assignments.size());
        List<GroupDTO> result = new ArrayList<>(assignments.size());

        for (com.kkc_lms.dto.Group.GroupCuratorAssignDTO a : assignments) {
            Long groupId = a.getGroupId();
            Long curatorId = a.getCuratorId();

            Group group = groupRepository.findById(groupId)
                    .orElseThrow(() -> new EntityNotFoundException("Группа не найдена: " + groupId));
            Teacher curator = teacherRepository.findById(curatorId)
                    .orElseThrow(() -> new EntityNotFoundException("Куратор не найден: " + curatorId));

            group.setCurator(curator);
            groupsToSave.add(group);
        }

        List<Group> saved = groupRepository.saveAll(groupsToSave);
        for (Group g : saved) {
            result.add(mapToDTO(g));
        }
        return result;
    }

    @Override
    public GroupDTO saveGroup(GroupCreateDTO dto) {
        Direction direction = directionRepository.findById(dto.getDirectionId())
                .orElseThrow(() -> new EntityNotFoundException("Направление не найдено"));
        Teacher curator = teacherRepository.findById(dto.getCuratorId())
                .orElseThrow(() -> new EntityNotFoundException("Куратор (преподаватель) не найден"));

        Group group = new Group();
        group.setName(dto.getName());
        group.setDirection(direction);
        group.setCurator(curator);
        group.setStudentCount(0);

        Group saved = groupRepository.save(group);
        return mapToDTO(saved);
    }

    @Override
    public Optional<GroupDTO> getGroupById(Long id) {
        return groupRepository.findById(id).map(this::mapToDTO);
    }

    @Override
    public List<GroupDTO> getAllGroups() {
        return groupRepository.findAll().stream()
                .map(this::mapToDTO)
                .toList();
    }

    @Override
    public void deleteGroupById(Long id) {
        if (!groupRepository.existsById(id)) {
            throw new EntityNotFoundException("Группа не найдена");
        }
        groupRepository.deleteById(id);
    }

    private GroupDTO mapToDTO(Group group) {
        GroupDTO dto = new GroupDTO();
        dto.setId(group.getId());
        dto.setName(group.getName());
        dto.setStudentCount(group.getStudentCount());


        Direction dir = group.getDirection();
        if (dir != null) {
            dto.setDirectionId(dir.getId());
            dto.setDirectionName(dir.getName());
        }

        Teacher curator = group.getCurator();
        String curatorName = "Без куратора";
        if (curator != null) {
            if (curator.getUser() != null) {
                curatorName = curator.getUser().getFullname();
            } else {
                curatorName = "Преподаватель без пользователя";
            }
            dto.setCuratorId(curator.getId());
        }
        dto.setCuratorFullName(curatorName);

        List<StudentDTO> students = studentRepository.findByGroup(group)
                .stream()
                .map(this::mapStudentToDTO)
                .toList();
        dto.setStudents(students);

        return dto;
    }



    @Transactional
    public List<GroupDTO> distributeStudentsByCourseAndDirection(Integer courseNumber, Long directionId) {
        Course course = Course.fromNumber(courseNumber);
        Direction direction = directionRepository.findById(directionId)
                .orElseThrow(() -> new EntityNotFoundException("Направление не найдено"));

        List<Student> students = studentRepository.findByCourseAndDirection(course, direction);
        if (students.isEmpty()) return Collections.emptyList();

        // Открепляем студентов от старых групп
        students.forEach(s -> s.setGroup(null));
        studentRepository.saveAll(students);

        Collections.shuffle(students, new Random());

        int n = students.size();
        int k = (int) Math.ceil(n / (double) MAX_PER_GROUP);
        if (k <= 0) return Collections.emptyList();

        int base = n / k;
        int rem = n % k;

        List<GroupDTO> created = new ArrayList<>();
        int index = 0;

        for (int i = 0; i < k; i++) {
            int size = base + (i < rem ? 1 : 0);
            Group g = new Group();
            g.setName(direction.getName() + "-" + course.getNumber() + "-G" + (i + 1));
            g.setDirection(direction);
            g.setStudentCount(size); // сразу сохраняем количество студентов
            Group saved = groupRepository.save(g);

            List<Student> chunk = students.subList(index, index + size);
            chunk.forEach(s -> s.setGroup(saved));
            studentRepository.saveAll(chunk);

            created.add(mapToDTO(saved));
            index += size;
        }

        return created;
    }

    // Новый метод для POST запроса, чтобы получить студентов группы и количество
    @Transactional
    public Map<String, Object> getGroupStudents(Long groupId) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new EntityNotFoundException("Группа не найдена: " + groupId));

        List<Student> students = studentRepository.findByGroup(group);

        Map<String, Object> response = new HashMap<>();
        response.put("groupName", group.getName());
        response.put("studentCount", students.size());
        response.put("students", students.stream()
                .map(s -> s.getUser() != null ? s.getUser().getFullname() : "Unknown")
                .toList());

        return response;
    }

    @Override
    public GroupDTO updateGroup(Long id, GroupCreateDTO dto) {
        Group group = groupRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Группа не найдена"));

        Direction direction = directionRepository.findById(dto.getDirectionId())
                .orElseThrow(() -> new EntityNotFoundException("Направление не найдено"));

        Teacher curator = teacherRepository.findById(dto.getCuratorId())
                .orElseThrow(() -> new EntityNotFoundException("Куратор (преподаватель) не найден"));

        group.setName(dto.getName());
        group.setDirection(direction);
        group.setCurator(curator);

        Group saved = groupRepository.save(group);
        return mapToDTO(saved);
    }

    @Override
    public List<GroupDTO> searchGroups(String search, String directionName) {
        List<Group> groups = groupRepository.findAll();

        if (search != null && !search.isBlank()) {
            String lowerSearch = search.toLowerCase();
            groups = groups.stream()
                    .filter(g -> g.getCurator() != null
                            && g.getCurator().getUser() != null
                            && g.getCurator().getUser().getFullname().toLowerCase().contains(lowerSearch))
                    .toList();
        }

        if (directionName != null && !directionName.isBlank()) {
            groups = groups.stream()
                    .filter(g -> g.getDirection() != null
                            && g.getDirection().getName().equals(directionName))
                    .toList();
        }

        return groups.stream().map(this::mapToDTO).toList();
    }



}
