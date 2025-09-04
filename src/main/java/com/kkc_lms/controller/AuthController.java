package com.kkc_lms.controller;

import com.kkc_lms.dto.Profile.ChangePasswordRequest;
import com.kkc_lms.dto.User.LoginRequest;
import com.kkc_lms.entity.Role;
import com.kkc_lms.entity.Student;
import com.kkc_lms.entity.User;
import com.kkc_lms.repository.StudentRepository;
import com.kkc_lms.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;

    public AuthController(UserRepository userRepository,
                          StudentRepository studentRepository) {
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest,
                                   HttpServletRequest request,
                                   HttpServletResponse response) {
        Optional<User> userOpt = userRepository.findByUsername(loginRequest.username());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid credentials"));
        }
        User user = userOpt.get();

        // проверка plain text пароля
        if (!loginRequest.password().equals(user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid credentials"));
        }

        // создаём сессию
        HttpSession session = request.getSession(true);
        session.setAttribute("user", user);

        String role = user.getRole() != null ? user.getRole().name() : "UNKNOWN";
        String redirect = getRedirectForRole(role);

        return ResponseEntity.ok(Map.of(
                "message", "Login successful",
                "username", user.getUsername(),
                "role", role,
                "redirect", redirect
        ));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null) session.invalidate();
        return ResponseEntity.ok(Map.of("message", "Logged out"));
    }

    @GetMapping("/me")
    public ResponseEntity<?> meFull(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("authenticated", false));
        }

        User user = (User) session.getAttribute("user");
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("authenticated", false));
        }

        var response = new java.util.LinkedHashMap<String, Object>();
        response.put("authenticated", true);
        response.put("username", user.getUsername());
        response.put("fullname", user.getFullname());
        response.put("email", user.getEmail());
        response.put("role", user.getRole() != null ? user.getRole().name() : "UNKNOWN");

        if (user.getRole() == Role.STUDENT) {
            Optional<Student> studentOpt = studentRepository.findByUser(user);
            studentOpt.ifPresent(st -> {
                String groupName = st.getGroup() != null ? st.getGroup().getName() : null;
                String directionName = st.getDirection() != null ? st.getDirection().getName() : null;

                response.put("student", Map.of(
                        "id", st.getId(),
                        "studentIdNumber", st.getStudentIdNumber(),
                        "groupName", groupName,
                        "direction", directionName
                ));
            });
        }

        return ResponseEntity.ok(response);
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest req,
                                            HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Not authenticated"));
        }

        User user = (User) session.getAttribute("user");
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Not authenticated"));
        }

        // проверка старого пароля
        if (!req.oldPassword().equals(user.getPassword())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Old password is incorrect"));
        }

        // проверка нового пароля
        if (req.newPassword() == null || !req.newPassword().equals(req.confirmPassword())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "New passwords do not match"));
        }

        if (req.newPassword().length() < 6) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "New password too short (min 6)"));
        }

        user.setPassword(req.newPassword());
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Password changed"));
    }

    private String getRedirectForRole(String role) {
        return switch (role) {
            case "ADMIN" -> "/app/admin/dashboard";
            case "TEACHER" -> "/app/teacher/dashboard";
            case "STUDENT" -> "/app/student/dashboard";
            case "METHODIST" -> "/app/methodist/dashboard";
            case "ACCOUNTANT" -> "/app/accountant/dashboard";
            default -> "/app/";
        };
    }
}
