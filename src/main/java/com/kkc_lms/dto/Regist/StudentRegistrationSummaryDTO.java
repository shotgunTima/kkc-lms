package com.kkc_lms.dto.Regist;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentRegistrationSummaryDTO {
    private Long studentId;
    private String studentFullName;
    private List<OfferingRegistrationDTO> offerings; // список офферингов и отмеченных регистраций
    private boolean registeredAll; // true если зарегистрирован на все офферинги в сессии
}
