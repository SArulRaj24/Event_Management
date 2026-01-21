package com.arul.Infosys.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class EventResponseDTO {

    private Long eventId;
    private String name;
    private String description;
    private String address;
    private String city;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer volunteersNeeded;
//    private String type;
    private Boolean registrationAllowed;
    private Float rating;


}
