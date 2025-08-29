package com.kkc_lms.service.Student;

import com.kkc_lms.dto.Student.StudentCreateDTO;
import com.kkc_lms.dto.Student.StudentDTO;
import com.kkc_lms.entity.*;
import com.kkc_lms.repository.DirectionRepository;
import com.kkc_lms.repository.GroupRepository;
import com.kkc_lms.repository.StudentRepository;
import com.kkc_lms.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final GroupRepository groupRepository;
    private final DirectionRepository directionRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public List<Student> getStudentsByCourseAndDirection(Integer courseNumber, Long directionId) {
        Direction direction = directionRepository.findById(directionId)
                .orElseThrow(() -> new EntityNotFoundException("Направление не найдено"));

        Course course = Course.fromNumber(courseNumber);
        return studentRepository.findByCourseAndDirection(course, direction);
    }

    @Transactional
    public StudentDTO createForUser(User user,
                                    Long groupId,
                                    Long directionId,
                                    int admissionYear,
                                    Course course,
                                    boolean contractPaid,
                                    StudentStatus status,
                                    int totalCredits,
                                    String studentIdNumber) {

        Direction direction = directionRepository.findById(directionId)
                .orElseThrow(() -> new IllegalArgumentException("Direction not found"));

        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new IllegalArgumentException("Group not found"));

        Student s = new Student();
        s.setUser(user);
        s.setDirection(direction);
        s.setGroup(group);
        s.setAdmissionYear(admissionYear > 0 ? admissionYear : LocalDate.now().getYear());
        s.setTotalCredits(totalCredits);
        s.setContractPaid(contractPaid);
        s.setStatus(status != null ? status : StudentStatus.ACTIVE);
        s.setCourse(course != null ? course : Course.FIRST);


        if (studentIdNumber == null || studentIdNumber.isBlank()) {
            s.setStudentIdNumber(generateUniqueStudentIdNumber());
        } else {
            if (studentRepository.existsByStudentIdNumber(studentIdNumber)) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "StudentIdNumber already exists");
            }
            s.setStudentIdNumber(studentIdNumber);
        }


        Student saved = studentRepository.save(s);
        return mapToDTO(saved);
    }


    /**
     * Генерация уникального номера студента: {YYYY}{6-значный случайный номер с ведущими нулями}
     * Проверяет через studentRepository.existsByStudentIdNumber(...)
     */
    private String generateUniqueStudentIdNumber() {
        String candidate;
        do {
            int year = LocalDate.now().getYear();
            int randomNum = ThreadLocalRandom.current().nextInt(0, 1_000_000); // 0..999999
            candidate = String.format("%d%06d", year, randomNum);
        } while (studentRepository.existsByStudentIdNumber(candidate));
        return candidate;
    }

    @Override
    @Transactional
    public StudentDTO saveStudent(StudentCreateDTO dto) {
        if (userRepository.existsByUsername(dto.getUsername())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Пользователь с таким username уже существует");
        }

        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Пользователь с таким email уже существует");
        }

        // Создаём пользователя
        User user = new User();
        user.setUsername(dto.getUsername());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setFullname(dto.getFullname());
        user.setEmail(dto.getEmail());
        user.setPhonenum(dto.getPhonenum());
        user.setRole(Role.STUDENT);
        userRepository.save(user);

        // Получаем группу
        Group group = groupRepository.findById(dto.getGroupId())
                .orElseThrow(() -> new IllegalArgumentException("Group not found"));

        // Получаем направление
        Direction direction = directionRepository.findById(dto.getDirectionId())
                .orElseThrow(() -> new IllegalArgumentException("Direction not found"));

        // Создаём студента
        Student student = new Student();
        student.setUser(user);
        student.setGroup(group);
        student.setDirection(direction);

        String sid = dto.getStudentIdNumber();
        if (sid == null || sid.isBlank()) {
            sid = generateUniqueStudentIdNumber(); // <-- если не передан, сгенерировать
        } else {
            // Если передан — убедиться в уникальности
            if (studentRepository.existsByStudentIdNumber(sid)) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "StudentIdNumber already exists");
            }
        }
        student.setStudentIdNumber(sid);

        student.setTotalCredits(dto.getTotalCredits());
        student.setAdmissionYear(dto.getAdmissionYear() != 0 ? dto.getAdmissionYear() : LocalDate.now().getYear());
        student.setContractPaid(dto.isContractPaid());
        student.setStatus(dto.getStatus() != null ? dto.getStatus() : StudentStatus.ACTIVE);
        student.setCourse(dto.getCourse() != null ? dto.getCourse() : Course.FIRST);

        studentRepository.save(student);

        return mapToDTO(student);
    }

    @Override
    @Transactional
    public StudentDTO updateStudent(Long id, StudentCreateDTO dto) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Студент не найден"));

        // Обновим связанные поля пользователя
        User user = student.getUser();
        if (user != null) {
            if (dto.getUsername() != null) user.setUsername(dto.getUsername());
            if (dto.getPassword() != null && !dto.getPassword().isBlank())
                user.setPassword(passwordEncoder.encode(dto.getPassword()));
            if (dto.getFullname() != null) user.setFullname(dto.getFullname());
            if (dto.getEmail() != null) user.setEmail(dto.getEmail());
            if (dto.getPhonenum() != null) user.setPhonenum(dto.getPhonenum());
            userRepository.save(user);
        }

        // Группа/направление
        if (dto.getGroupId() != null) {
            Group group = groupRepository.findById(dto.getGroupId())
                    .orElseThrow(() -> new IllegalArgumentException("Group not found"));
            student.setGroup(group);
        }
        if (dto.getDirectionId() != null) {
            Direction direction = directionRepository.findById(dto.getDirectionId())
                    .orElseThrow(() -> new IllegalArgumentException("Direction not found"));
            student.setDirection(direction);
        }

        // Остальные поля
        if (dto.getStudentIdNumber() != null && !dto.getStudentIdNumber().isBlank()) {
            // если меняем sid — проверить на уникальность (если другой студент с таким же exists)
            String newSid = dto.getStudentIdNumber();
            if (!newSid.equals(student.getStudentIdNumber()) && studentRepository.existsByStudentIdNumber(newSid)) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "StudentIdNumber already exists");
            }
            student.setStudentIdNumber(newSid);
        }

        student.setTotalCredits(dto.getTotalCredits());
        if (dto.getAdmissionYear() != 0) student.setAdmissionYear(dto.getAdmissionYear());
        student.setContractPaid(dto.isContractPaid());
        if (dto.getStatus() != null) student.setStatus(dto.getStatus());
        if (dto.getCourse() != null) student.setCourse(dto.getCourse());

        Student saved = studentRepository.save(student);
        return mapToDTO(saved);
    }



    @Transactional
    @Override
    public StudentDTO updateStudentDetails(Long userId,
                                           Long groupId,
                                           Long directionId,
                                           int admissionYear,
                                           Course course,
                                           boolean contractPaid,
                                           StudentStatus status,
                                           int totalCredits,
                                           String studentIdNumber) {
        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("Студент не найден"));

        if (groupId != null) {
            Group group = groupRepository.findById(groupId)
                    .orElseThrow(() -> new IllegalArgumentException("Group not found"));
            student.setGroup(group);
        }

        if (directionId != null) {
            Direction direction = directionRepository.findById(directionId)
                    .orElseThrow(() -> new IllegalArgumentException("Direction not found"));
            student.setDirection(direction);
        }

        if (admissionYear > 0) student.setAdmissionYear(admissionYear);
        if (course != null) student.setCourse(course);

        student.setContractPaid(contractPaid);
        if (status != null) student.setStatus(status);
        student.setTotalCredits(totalCredits);

        if (studentIdNumber != null && !studentIdNumber.isBlank()) {
            if (!studentIdNumber.equals(student.getStudentIdNumber())
                    && studentRepository.existsByStudentIdNumber(studentIdNumber)) {
                throw new IllegalArgumentException("StudentIdNumber already exists");
            }
            student.setStudentIdNumber(studentIdNumber);
        }

        Student saved = studentRepository.save(student);
        return mapToDTO(saved);
    }


    @Override
    public Optional<StudentDTO> getStudentById(Long id) {
        return studentRepository.findById(id).map(this::mapToDTO);
    }

    @Override
    public Optional<StudentDTO> getByStudentIdNumber(String studentIdNumber) {
        return studentRepository.findByStudentIdNumber(studentIdNumber)
                .map(this::mapToDTO);
    }

    @Override
    public List<StudentDTO> getAllStudents() {
        return studentRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteStudentById(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Студент не найден"));
        Long userId = student.getUser().getId();

        studentRepository.delete(student);
        userRepository.deleteById(userId); // <-- удаляем пользователя
    }


    @Transactional
    public void deleteByUserId(Long userId) {
        studentRepository.deleteByUserId(userId);
    }

    private StudentDTO mapToDTO(Student student) {
        StudentDTO dto = new StudentDTO();
        dto.setId(student.getId());

        if (student.getUser() != null) {
            dto.setUserId(student.getUser().getId());
            dto.setUsername(student.getUser().getUsername());
            dto.setFullname(student.getUser().getFullname());
            dto.setEmail(student.getUser().getEmail());
            dto.setPhonenum(student.getUser().getPhonenum());
        }

        dto.setStudentIdNumber(student.getStudentIdNumber());

        if (student.getGroup() != null) {
            dto.setGroupId(student.getGroup().getId());
            dto.setGroupName(student.getGroup().getName());
        }

        if (student.getDirection() != null) {
            dto.setDirectionId(student.getDirection().getId());
            dto.setDirectionName(student.getDirection().getName());
        }

        dto.setTotalCredits(student.getTotalCredits());
        dto.setAdmissionYear(student.getAdmissionYear());

        dto.setStatus(student.getStatus());
        dto.setCourse(Course.fromNumber(student.getCourse() != null ? student.getCourse().getNumber() : null));
        dto.setContractPaid(student.isContractPaid());

        return dto;
    }
}
