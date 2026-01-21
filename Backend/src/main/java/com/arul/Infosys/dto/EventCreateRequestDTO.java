package com.arul.Infosys.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class EventCreateRequestDTO {

    private String name;
    private String description;
    private String address;
    private String city;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer maximumAllowedRegistrations;
    private Boolean registrationAllowed;


}
