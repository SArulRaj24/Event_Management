package com.arul.Infosys.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_session")
@Data
public class UserSession {

    @Id
    @Column(name = "session_id", length = 128)
    private String sessionId;               // HttpSession.getId()

    @Column(name = "email_id", nullable = false, length = 150)
    private String emailId;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    @Column(name = "active", nullable = false)
    private boolean active;
}
