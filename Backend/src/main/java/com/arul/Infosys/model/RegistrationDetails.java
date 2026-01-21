package com.arul.Infosys.model;

import com.arul.Infosys.model.key.RegistrationKey;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "registration_details")
@IdClass(RegistrationKey.class)
public class RegistrationDetails {


    @Id
    @Column(name = "event_id")
    private Long eventId;

    @Id
    @Column(name = "volunteer_id")
    private String volunteerId;



    @Column(nullable = false)
    private String status;

    @Column(nullable = false)
    private Boolean checkIn;

    private Integer rating;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime modifiedAt;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", insertable = false, updatable = false)
    private EventDetails event;

    public RegistrationDetails() {}


}
