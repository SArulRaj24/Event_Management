package com.arul.Infosys.dto;

import lombok.Data;

@Data
public class FeedbackDTO {
    public Long eventId;
    public String emailId;
    public Integer rating;
}
