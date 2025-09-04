package com.kkc_lms.controller;


import com.kkc_lms.dto.User.LoginRequest;
import com.kkc_lms.service.Security.CustomUserDetails;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;

    public AuthController(AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest,
                                   HttpServletRequest request,
                                   HttpServletResponse response) {
        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.username(), loginRequest.password())
            );

            SecurityContextHolder.getContext().setAuthentication(auth);
            HttpSession session = request.getSession(true);

            // Получаем роль из CustomUserDetails
            Object principal = auth.getPrincipal();
            String role = "UNKNOWN";
            if (principal instanceof CustomUserDetails) {
                role = ((CustomUserDetails) principal).getUser().getRole().name();
            }

            String redirect = getRedirectForRole(role);

            // Если запрос от браузера (html), можно сделать редирект:
            String accept = request.getHeader("Accept");
            if (accept != null && accept.contains("text/html")) {
                try {
                    response.sendRedirect(redirect);
                    return ResponseEntity.status(HttpStatus.FOUND).build();
                } catch (Exception ignored) {}
            }

            // По умолчанию возвращаем JSON с ролью и рекомендацией куда идти
            return ResponseEntity.ok(Map.of(
                    "message", "Login successful",
                    "username", auth.getName(),
                    "role", role,
                    "redirect", redirect
            ));
        } catch (AuthenticationException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid credentials"));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        SecurityContextHolder.clearContext();
        HttpSession session = request.getSession(false);
        if (session != null) session.invalidate();
        return ResponseEntity.ok(Map.of("message", "Logged out"));
    }

    // Возвращает текущего пользователя и роль (нужен аутентифицированный запрос)
    @GetMapping("/me")
    public ResponseEntity<?> me() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth.getPrincipal() instanceof String) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("authenticated", false));
        }
        Object principal = auth.getPrincipal();
        String username = auth.getName();
        String role = "UNKNOWN";
        if (principal instanceof CustomUserDetails) {
            role = ((CustomUserDetails) principal).getUser().getRole().name();
        }
        return ResponseEntity.ok(Map.of(
                "authenticated", true,
                "username", username,
                "role", role
        ));
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
