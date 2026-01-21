package com.arul.Infosys.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Data
@Entity
@Table(name = "event_details")
public class EventDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long eventId;
    @Column(name = "created_by", nullable = false)
    private String createdBy;

    private String eventName;
    private String description;
    private String address;
    private String city;
    private String organizerId;

    private Integer maxAllowedRegistrations;
    private LocalDate eventStartDate;
    private LocalDate eventEndDate;

    private Float rating;
    private Boolean registrationAllowed;

    private LocalDate createdAt;
    private LocalDate modifiedAt;

    public EventDetails() {}


    public EventDetails(
            Long eventId,
            String createdBy,
            String eventName,
            String description,
            String address,
            String city,
            String organizerId,
            Integer maxAllowedRegistrations,
            LocalDate eventStartDate,
            LocalDate eventEndDate,
            Float rating,
            Boolean registrationAllowed
    ) {
        this.eventId = eventId;
        this.createdBy=createdBy;
        this.eventName = eventName;
        this.description = description;
        this.address = address;
        this.city = city;
        this.organizerId = organizerId;
        this.maxAllowedRegistrations = maxAllowedRegistrations;
        this.eventStartDate = eventStartDate;
        this.eventEndDate = eventEndDate;
        this.rating = rating;
        this.registrationAllowed = registrationAllowed;
        this.createdAt = LocalDate.now();
        this.modifiedAt = LocalDate.now();
    }


}
