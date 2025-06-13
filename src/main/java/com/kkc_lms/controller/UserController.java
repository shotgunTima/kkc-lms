package com.kkc_lms.controller;

import com.kkc_lms.dto.User.*;

import com.kkc_lms.service.User.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping
    public UserDTO create(@RequestBody @Valid UserCreateDTO dto) {
        return userService.create(dto);
    }

    @PutMapping("/{id}")
    public UserDTO update(@PathVariable Long id, @RequestBody @Valid UserUpdateDTO dto) {
        return userService.update(id, dto);
    }

    @GetMapping("/{id}")
    public UserDTO getById(@PathVariable Long id) {
        return userService.getById(id);
    }

    @GetMapping
    public List<UserDTO> getAll() {
        return userService.getAll();
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        userService.delete(id);
    }

    @GetMapping("/search")
    public List<UserDTO> searchByUsername(@RequestParam String username) {
        return userService.searchByUsername(username);
    }

}

