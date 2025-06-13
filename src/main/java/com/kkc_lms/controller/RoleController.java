package com.kkc_lms.controller;

import com.kkc_lms.entity.Role;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/roles")
public class RoleController {

    @GetMapping
    public List<String> getAllRoles() {
        return Arrays.stream(Role.values())
                .map(Enum::name)
                .collect(Collectors.toList());
    }

    @GetMapping("/labels")
    public List<Map<String, String>> getRoleLabels() {
        return Arrays.stream(Role.values())
                .map(role -> Map.of(
                        "value", role.name(),
                        "label", role.getLabel()
                ))
                .collect(Collectors.toList());
    }
}
