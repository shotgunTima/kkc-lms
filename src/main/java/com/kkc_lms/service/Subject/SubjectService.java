package com.kkc_lms.service.Subject;


import com.kkc_lms.dto.Subject.SubjectCreateDTO;
import com.kkc_lms.dto.Subject.SubjectOutputDTO;
import com.kkc_lms.dto.Subject.SubjectUpdateDTO;

import java.util.List;

public interface SubjectService {
    SubjectOutputDTO create(SubjectCreateDTO dto);
    List<SubjectOutputDTO> getAll();
    SubjectOutputDTO getById(Long id);
    void delete(Long id);
    SubjectOutputDTO update(Long id, SubjectUpdateDTO dto);

}

