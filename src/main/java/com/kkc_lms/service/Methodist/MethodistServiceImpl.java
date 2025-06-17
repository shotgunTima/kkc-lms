package com.kkc_lms.service.Methodist;

import com.kkc_lms.entity.Methodist;
import com.kkc_lms.entity.User;
import com.kkc_lms.repository.MethodistRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MethodistServiceImpl {

    private final MethodistRepository methodistRepository;

    @Transactional
    public Methodist createForUser(User user) {
        Methodist m = new Methodist();
        m.setUser(user);
        return methodistRepository.save(m);
    }

}
