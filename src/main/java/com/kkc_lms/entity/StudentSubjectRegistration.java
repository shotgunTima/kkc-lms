package com.kkc_lms.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "student_subject_registrations", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"student_id", "slot_id"})
})
@Data
public class StudentSubjectRegistration {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "student_id")
    private Student student;

    @ManyToOne(optional = false)
    @JoinColumn(name = "slot_id")
    private RegistrationSlot slot;

    // флажок — зарегистрирован (true) или отменил (false)
    private boolean active = false;

    private LocalDateTime registeredAt;
    private LocalDateTime canceledAt;
}
