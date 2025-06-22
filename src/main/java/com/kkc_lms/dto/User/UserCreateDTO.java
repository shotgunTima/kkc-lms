package com.kkc_lms.dto.User;

import jakarta.validation.constraints.*;
import lombok.Data;
import com.kkc_lms.entity.Role;


@Data
public class UserCreateDTO {

        @NotBlank(message = "Имя пользователя не должно быть пустым")

        private String username;

        @NotBlank(message = "Пароль не должен быть пустым")

        @Size(min = 6, message = "Пароль должен содержать минимум 6 символов")
//        @Pattern(
//                regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}$",
//                message = "Пароль должен содержать минимум одну цифру, одну строчную и одну заглавную букву"
//        )
        private String password;

        @Email(message = "Некорректный email")
        @NotBlank(message = "Email не должен быть пустым")

        private String email;

        @NotBlank(message = "Это поле должно быть заполнено")
        private String fullname;

        @NotNull(message = "Роль должна быть указана")
        private Role role;

        @Pattern(
                regexp = "\\+996\\d{9}",
                message = "Телефон должен быть в формате +996XXXXXXXXX"
        )
        private String phonenum;

        @NotBlank
        private String address;

        private String profileImage;

        private Long directionId;

}
