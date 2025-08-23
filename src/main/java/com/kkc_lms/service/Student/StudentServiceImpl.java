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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;

@Service

public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final GroupRepository groupRepository;
    private final DirectionRepository directionRepository;


    @Autowired
    public StudentServiceImpl(StudentRepository studentRepository,
                              UserRepository userRepository,
                              GroupRepository groupRepository,DirectionRepository directionRepository) {
        this.studentRepository = studentRepository;
        this.userRepository = userRepository;
        this.groupRepository = groupRepository;
        this.directionRepository = directionRepository;
    }
    @Override
    public List<Student> getStudentsByCourseAndDirection(Integer courseNumber, Long directionId) {
        Direction direction = directionRepository.findById(directionId)
                .orElseThrow(() -> new EntityNotFoundException("Направление не найдено"));

        Course course = Course.fromNumber(courseNumber);
        return studentRepository.findByCourseAndDirection(course, direction);
    }


    @Override
    @Transactional
    public StudentDTO createForUser(User user, Long directionId, Integer courseNumber) {
        Direction direction = directionRepository.findById(directionId)
                .orElseThrow(() -> new IllegalArgumentException("Direction not found"));

        Student s = new Student();
        s.setUser(user);
        s.setDirection(direction);
        s.setAdmissionYear(LocalDate.now().getYear());
        s.setTotalCredits(0);
        s.setStudentIdNumber(generateUniqueStudentIdNumber());
        s.setContractPaid(false);
        s.setStatus(StudentStatus.ACTIVE);

        // Устанавливаем курс (можно делать обязательным ранее)
        if (courseNumber != null) {
            s.setCourse(Course.fromNumber(courseNumber));
        } // иначе оставляем null или ставим Course.FIRST, если нужно по умолчанию

        Student saved = studentRepository.save(s);
        return mapToDTO(saved);
    }

    private String generateUniqueStudentIdNumber() {
        String candidate;
        do {
            int year = LocalDate.now().getYear();
            int randomNum = ThreadLocalRandom.current().nextInt(0, 1_000_000);
            candidate = String.format("%d%06d", year, randomNum);
        } while (studentRepository.existsByStudentIdNumber(candidate));
        return candidate;
    }

    @Override
    public StudentDTO saveStudent(StudentCreateDTO dto) {
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Group group = groupRepository.findById(dto.getGroupId())
                .orElseThrow(() -> new IllegalArgumentException("Group not found"));

        Student student = new Student();
        student.setUser(user);
        student.setStudentIdNumber(dto.getStudentIdNumber());
        student.setGroup(group);
        student.setTotalCredits(dto.getTotalCredits());
        student.setAdmissionYear(dto.getAdmissionYear());

        return mapToDTO(studentRepository.save(student));
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
    public void deleteStudentById(Long id) {
        studentRepository.deleteById(id);
    }

    private StudentDTO mapToDTO(Student student) {
        StudentDTO dto = new StudentDTO();
        dto.setId(student.getId());
        dto.setUserId(student.getUser().getId());
        dto.setUsername(student.getUser().getUsername());
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
        return dto;
    }

}
