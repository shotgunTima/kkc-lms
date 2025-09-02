package com.kkc_lms.dto.Regist;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentSubjectRegistrationDTO {
    private Long id;
    private Long studentId;
    private String studentFullName;
    private Long slotId;
    private Long offeringId;
    private boolean active;
    private LocalDateTime registeredAt;
    private LocalDateTime canceledAt;
}