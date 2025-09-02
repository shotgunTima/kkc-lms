package com.kkc_lms.dto.Regist;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GroupRegistrationsDTO {
    private Long groupId;
    private String groupName;
    private List<StudentRegistrationSummaryDTO> students;
}
