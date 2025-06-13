package com.kkc_lms.service.Student;

import com.kkc_lms.dto.Student.StudentCreateDTO;
import com.kkc_lms.dto.Student.StudentDTO;
import com.kkc_lms.entity.Group;
import com.kkc_lms.entity.Student;
import com.kkc_lms.entity.User;
import com.kkc_lms.repository.GroupRepository;
import com.kkc_lms.repository.StudentRepository;
import com.kkc_lms.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final GroupRepository groupRepository;

    @Autowired
    public StudentServiceImpl(StudentRepository studentRepository,
                              UserRepository userRepository,
                              GroupRepository groupRepository) {
        this.studentRepository = studentRepository;
        this.userRepository = userRepository;
        this.groupRepository = groupRepository;
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
        dto.setGroupId(student.getGroup() != null ? student.getGroup().getId() : null);
        dto.setGroupName(student.getGroup() != null ? student.getGroup().getName() : null);
        dto.setTotalCredits(student.getTotalCredits());
        dto.setAdmissionYear(student.getAdmissionYear());
        return dto;
    }
}
