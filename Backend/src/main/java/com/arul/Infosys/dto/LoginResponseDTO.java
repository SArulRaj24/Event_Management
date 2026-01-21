package com.arul.Infosys.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponseDTO {
    private String message;
    private String token;    // The critical field for your new auth flow
    private String emailId;
    private String role;
}