package com.kkc_lms.dto.Regist;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OfferingRegistrationDTO {
    private Long offeringId;
    private String offeringCode;
    private String offeringName;
    private boolean registered; // true если студент зарегистрирован на этот offering
    private Long registrationId; // id записи регистрации (если есть)
}
