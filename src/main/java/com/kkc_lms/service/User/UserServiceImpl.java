package com.kkc_lms.service.User;

import com.kkc_lms.dto.User.*;
import com.kkc_lms.entity.Role;
import com.kkc_lms.entity.User;
import com.kkc_lms.repository.UserRepository;
import com.kkc_lms.service.Accontant.AccountantServiceImpl;
import com.kkc_lms.service.Administrator.AdministratorServiceImpl;
import com.kkc_lms.service.Methodist.MethodistServiceImpl;
import com.kkc_lms.service.Student.StudentServiceImpl;
import com.kkc_lms.service.Teacher.TeacherServiceImpl;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    private final StudentServiceImpl studentService;
    private final TeacherServiceImpl teacherService;
    private final MethodistServiceImpl methodistService;
    private final AccountantServiceImpl accountantService;
    private final AdministratorServiceImpl administratorService;

    private UserDTO toDTO(User user) {
        return new UserDTO(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFullname(),
                user.getRole(),
                user.getPhonenum(),
                user.getAddress(),
                user.getProfileImage(),
                user.getCreatedAt(),
                user.getLastLogin(),
                user.getRole().getLabel()
        );
    }

    @Override
    @Transactional
    public UserDTO create(UserCreateDTO dto) {
        if (userRepository.existsByUsername(dto.getUsername()))
            throw new IllegalArgumentException("Username already exists");
        if (userRepository.existsByEmail(dto.getEmail()))
            throw new IllegalArgumentException("Email already exists");

        User user = new User();
        user.setUsername(dto.getUsername());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setEmail(dto.getEmail());
        user.setFullname(dto.getFullname());
        user.setRole(dto.getRole());
        user.setPhonenum(dto.getPhonenum());
        user.setAddress(dto.getAddress());
        user.setProfileImage(dto.getProfileImage());

        if (dto.getRole() == Role.STUDENT && dto.getDirectionId() == null) {
            throw new IllegalArgumentException("Direction ID is required for student");
        }
        if (dto.getRole() == Role.STUDENT && dto.getCourse() == null) {
            throw new IllegalArgumentException("Course is required for student");
        }


        User savedUser = userRepository.save(user);

        Role role = savedUser.getRole();
        switch (role) {
            case STUDENT -> studentService.createForUser(
                    savedUser,
                    dto.getGroupId(),
                    dto.getDirectionId(),
                    dto.getAdmissionYear(),
                    dto.getCourse(),
                    dto.isContractPaid(),
                    dto.getStudentStatus(),
                    dto.getTotalCredits(),
                    dto.getStudentIdNumber() // если null → сгенерим внутри studentService
            );
            case TEACHER -> teacherService.createForUserWithDetails(
                    savedUser,
                    dto.getAcademicTitle(),
                    dto.getTeacherStatus(),
                    dto.getHireDate()
            );
            case ADMIN -> administratorService.createForUser(savedUser);
            case METHODIST -> methodistService.createForUser(savedUser);
            case ACCOUNTANT -> accountantService.createForUser(savedUser);
            default -> throw new IllegalArgumentException("Unsupported role: " + role);
        }

        return toDTO(savedUser);
    }

    @Override
    @Transactional
    public UserDTO update(Long id, UserUpdateDTO dto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        if (userRepository.existsByUsername(dto.getUsername()) && !user.getUsername().equals(dto.getUsername())) {
            throw new IllegalArgumentException("Username already exists");
        }
        if (userRepository.existsByEmail(dto.getEmail()) && !user.getEmail().equals(dto.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }

        Role oldRole = user.getRole();

        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setFullname(dto.getFullname());
        user.setRole(dto.getRole());
        user.setPhonenum(dto.getPhonenum());
        user.setAddress(dto.getAddress());
        user.setProfileImage(dto.getProfileImage());

        User savedUser = userRepository.save(user);

        Role newRole = savedUser.getRole();
        if (oldRole != newRole) {
            if (oldRole != Role.TEACHER && newRole == Role.TEACHER) {
                teacherService.createForUserWithDetails(savedUser, dto.getAcademicTitle(), dto.getTeacherStatus(), dto.getHireDate());
            } else if (oldRole == Role.TEACHER && newRole != Role.TEACHER) {
                teacherService.deleteByUserId(savedUser.getId());
            }
        } else if (newRole == Role.TEACHER) {
            teacherService.updateTeacherDetails(savedUser.getId(), dto.getAcademicTitle(), dto.getTeacherStatus(), dto.getHireDate());
        }else if (newRole == Role.STUDENT) {
                studentService.updateStudentDetails(
                        savedUser.getId(),
                        dto.getGroupId(),
                        dto.getDirectionId(),
                        dto.getAdmissionYear(),
                        dto.getCourse(),
                        dto.isContractPaid(),
                        dto.getStatus(),
                        dto.getTotalCredits(),
                        dto.getStudentIdNumber()
                );
            }

        return toDTO(savedUser);
    }

    @Override
    public UserDTO getById(Long id) {
        return userRepository.findById(id)
                .map(this::toDTO)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
    }

    @Override
    public List<UserDTO> getAll() {
        return userRepository.findAll().stream()
                .map(this::toDTO)
                .toList();
    }

    @Override
    public void delete(Long id) {
        if (!userRepository.existsById(id)) throw new EntityNotFoundException("User not found");
        userRepository.deleteById(id);
    }

    @Override
    public List<UserDTO> searchByUsername(String username) {
        return userRepository.findAll().stream()
                .filter(u -> u.getUsername().toLowerCase().contains(username.toLowerCase()))
                .map(this::toDTO)
                .toList();
    }
}
