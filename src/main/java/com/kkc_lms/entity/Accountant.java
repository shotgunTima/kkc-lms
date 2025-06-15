package com.kkc_lms.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name="accountants")
public class Accountant {
    @Id
    @GeneratedValue
    private Long id;
    @OneToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;
}
