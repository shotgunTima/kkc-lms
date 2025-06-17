package com.kkc_lms.service.Administrator;

import com.kkc_lms.entity.Administrator;
import com.kkc_lms.entity.User;
import com.kkc_lms.repository.AdministratorRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdministratorServiceImpl {
    private final AdministratorRepository administratorRepository;

    @Transactional
    public Administrator createForUser(User user){
        Administrator administrator = new Administrator();
        administrator.setUser(user);
        return administratorRepository.save(administrator);
    }

}
