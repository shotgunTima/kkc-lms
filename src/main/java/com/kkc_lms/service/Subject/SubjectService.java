package com.kkc_lms.service.Subject;

import com.kkc_lms.dto.Subject.SubjectCreateDTO;
import com.kkc_lms.dto.Subject.SubjectDTO;
import com.kkc_lms.entity.Subject;

import java.util.List;

public interface SubjectService {

    Subject createSubject(SubjectCreateDTO dto);

    List<SubjectDTO> getAllSubjects();

    SubjectDTO getSubjectById(Long id);

    Subject updateSubject(Long id, SubjectCreateDTO dto);

    void deleteSubject(Long id);
}
