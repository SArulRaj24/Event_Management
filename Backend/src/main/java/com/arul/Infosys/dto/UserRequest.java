package com.arul.Infosys.dto;

import lombok.Data;

@Data
public class UserRequest {
    private String emailId;
    private String password;
    private String newPassword;
    private Long phone;
    private String address;
    private String role;
}
