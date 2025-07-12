package com.kkc_lms;

import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.server.ResponseStatusException;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, String> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();

        ex.getBindingResult().getFieldErrors().forEach(error ->
                errors.put(error.getField(), error.getDefaultMessage())
        );

        return errors;
    }

    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, String> handleIllegalArgumentException(IllegalArgumentException ex) {
        Map<String, String> errors = new HashMap<>();

        String message = ex.getMessage();

        if (message != null) {
            if (message.toLowerCase().contains("username")) {
                errors.put("username", "Пользователь с таким именем уже существует");
            } else if (message.toLowerCase().contains("email")) {
                errors.put("email", "Пользователь с таким email уже существует");
            } else {
                errors.put("error", message);
            }
        } else {
            errors.put("error", "Неверный запрос");
        }

        return errors;
    }
    @ExceptionHandler(EntityNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public Map<String, String> handleEntityNotFoundException(EntityNotFoundException ex) {
        Map<String, String> errors = new HashMap<>();
        String msg = ex.getMessage();
        errors.put("error", (msg != null && !msg.isBlank()) ? msg : "Сущность не найдена");
        return errors;
    }
    @ExceptionHandler(DataIntegrityViolationException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public Map<String, String> handleDataIntegrityViolationException(DataIntegrityViolationException ex) {
        Map<String, String> errors = new HashMap<>();
        String detail = ex.getRootCause() != null ? ex.getRootCause().getMessage() : ex.getMessage();
        errors.put("error", "Ошибка базы данных: " + detail);
        return errors;
    }

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);
    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public Map<String, String> handleAllUncaughtException(Exception ex) {
        logger.error("Unexpected error occurred", ex);
        Map<String, String> errors = new HashMap<>();
        errors.put("error", "Внутренняя ошибка сервера");
        return errors;
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, String>> handleResponseStatusException(ResponseStatusException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("error", ex.getReason() != null ? ex.getReason() : "Ошибка запроса");
        return new ResponseEntity<>(error, ex.getStatusCode());
    }

}
