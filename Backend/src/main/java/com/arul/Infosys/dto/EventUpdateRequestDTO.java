package com.arul.Infosys.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class EventUpdateRequestDTO {

    private Long eventId;
    private String name;
    private String address;
    private String city;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer maximumAllowedRegistrations;
    private Boolean registrationAllowed;


}
