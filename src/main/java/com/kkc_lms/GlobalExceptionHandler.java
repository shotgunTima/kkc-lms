package com.kkc_lms;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.MethodArgumentNotValidException;

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
}
