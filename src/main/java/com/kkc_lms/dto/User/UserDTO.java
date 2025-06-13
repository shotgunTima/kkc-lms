package com.kkc_lms.dto.User;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.kkc_lms.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data

@NoArgsConstructor
@AllArgsConstructor

public class UserDTO {

    private Long id;

    private String username;

    private String email;

    private String fullname;

    private Role role;

    private String phonenum;

    private String address;

    @JsonProperty("profileImage")
    private String profileimage;

    private LocalDateTime createdAt;
    private LocalDateTime lastLogin;

    @JsonProperty("roleLabel")
    private String roleLabel;

}
