package com.kkc_lms.service.Accontant;

import com.kkc_lms.entity.Accountant;
import com.kkc_lms.entity.User;
import com.kkc_lms.repository.AccountantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AccountantServiceImpl {
    private final AccountantRepository accountantRepository;

    public Accountant createForUser(User user){
        Accountant accountant = new Accountant();
        accountant.setUser(user);
        return accountantRepository.save(accountant);
    }

}
