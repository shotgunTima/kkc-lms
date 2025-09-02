package com.kkc_lms.dto.Regist;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegistrationSlotDTO {
    private Long id;
    private Long offeringId;
    private String offeringCode;
    private String offeringName;
    private boolean open;
    private Integer capacity;

    // Новые поля для пометки регистрации студента
    private boolean registered = false;      // true, если у студента есть активная регистрация на этот слот
    private Long registrationId = null;      // id записи StudentSubjectRegistration (если есть)
}
