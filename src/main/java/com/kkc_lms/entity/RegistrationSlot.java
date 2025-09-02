package com.kkc_lms.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "registration_slots", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"session_id", "offering_id"})
})
@Data
public class RegistrationSlot {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "session_id")
    private RegistrationSession session;

    @ManyToOne(optional = false)
    @JoinColumn(name = "offering_id")
    private SubjectOffering offering;

    // для простоты: флажок показывающий открыт ли слот (можно закрывать по предмету)
    private boolean open = true;
}
