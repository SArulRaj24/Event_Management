package com.arul.Infosys.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_details")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDetails {

    @Id
    @Column(name = "email_id", nullable = false, length = 150)
    private String emailId;

    @Column(nullable = false)
    private String password;

    @Column(name = "phone_number")
    private Long phone;

    @Column(nullable = false)
    private String address;

    @Column(name = "user_role", nullable = false, length = 20)
    private String role;

    @CreationTimestamp
    @Column(name = "created_time", nullable = false, updatable = false)
    private LocalDateTime createdTime;
}
