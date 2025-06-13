package com.kkc_lms.service.User;

import com.kkc_lms.dto.User.*;
import com.kkc_lms.entity.User;
import com.kkc_lms.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

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

        return toDTO(userRepository.save(user));
    }

    @Override
    public UserDTO update(Long id, UserUpdateDTO dto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        if (userRepository.existsByUsername(dto.getUsername()) && !user.getUsername().equals(dto.getUsername())) {
            throw new IllegalArgumentException("Username already exists");
        }
        if (userRepository.existsByEmail(dto.getEmail()) && !user.getEmail().equals(dto.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }

        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setFullname(dto.getFullname());
        user.setRole(dto.getRole());
        user.setPhonenum(dto.getPhonenum());
        user.setAddress(dto.getAddress());
        user.setProfileImage(dto.getProfileImage());


        return toDTO(userRepository.save(user));
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
