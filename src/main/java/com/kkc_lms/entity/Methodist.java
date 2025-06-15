package com.kkc_lms.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name="methodists")
public class Methodist {
    @Id
    @GeneratedValue
    private Long id;
    @OneToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

}
