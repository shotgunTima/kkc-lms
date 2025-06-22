package com.kkc_lms.service.User;

import com.kkc_lms.dto.User.*;

import java.util.List;

public interface UserService {
    UserDTO create(UserCreateDTO dto);
    UserDTO update(Long id, UserUpdateDTO dto);
    UserDTO getById(Long id);
    List<UserDTO> getAll();
    void delete(Long id);
}
