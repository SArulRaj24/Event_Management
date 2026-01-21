package com.arul.Infosys.service;

import com.arul.Infosys.dto.UserRequest;
import com.arul.Infosys.dto.MessageResponse;
import com.arul.Infosys.exception.InvalidRoleException;
import com.arul.Infosys.exception.UserNotFoundException;
import com.arul.Infosys.exception.WrongPasswordException;
import com.arul.Infosys.model.UserDetails;
import com.arul.Infosys.model.UserSession;
import com.arul.Infosys.repo.UserDetailsRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class UserService {

    private final UserDetailsRepository repo;

    public UserService(UserDetailsRepository repo) {
        this.repo = repo;
    }

    private void validateRoleOrThrow(String role) {
        if (role == null) {
            throw new InvalidRoleException("Role cannot be null. Allowed values: VOLUNTEER, ORGANIZER");
        }
        String normalized = role.trim().toUpperCase();
        if (!"VOLUNTEER".equals(normalized) && !"ORGANIZER".equals(normalized)) {
            throw new InvalidRoleException("Invalid role! Allowed values: VOLUNTEER, ORGANIZER");
        }
    }

    @Transactional
    public MessageResponse register(UserRequest req) {
        // basic validations
        if (req.getEmailId() == null || req.getEmailId().isBlank()) {
            throw new IllegalArgumentException("emailId is required");
        }
        if (req.getPassword() == null || req.getPassword().isBlank()) {
            throw new IllegalArgumentException("password is required");
        }
        if (req.getAddress() == null || req.getAddress().isBlank()) {
            throw new IllegalArgumentException("address is required");
        }
        // role validation
        validateRoleOrThrow(req.getRole());

        if (repo.existsById(req.getEmailId())) {
            return new MessageResponse("User already exists!");
        }

        UserDetails user = new UserDetails();
        user.setEmailId(req.getEmailId());
        user.setPassword(req.getPassword());
        user.setPhone(req.getPhone());
        user.setAddress(req.getAddress());
        user.setRole(req.getRole().trim().toUpperCase());

        repo.save(user);
        return new MessageResponse("Registration successful!");
    }

    public UserDetails login(UserRequest req) {
        if (req.getEmailId() == null || req.getPassword() == null) {
            throw new IllegalArgumentException("emailId and password are required");
        }

        UserDetails user = repo.findById(req.getEmailId())
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        if (!user.getPassword().equals(req.getPassword())) {
            throw new WrongPasswordException("Invalid credentials");
        }

        // return the authenticated user
        return user;
    }


    @Transactional
    public MessageResponse update(UserRequest req) {
        if (req.getEmailId() == null) {
            throw new IllegalArgumentException("emailId is required");
        }
        UserDetails user = repo.findById(req.getEmailId())
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        if (req.getPhone() != null) user.setPhone(req.getPhone());
        if (req.getAddress() != null && !req.getAddress().isBlank()) user.setAddress(req.getAddress());

        repo.save(user);
        return new MessageResponse("User updated successfully!");
    }

    @Transactional
    public MessageResponse resetPassword(UserRequest req) {
        // expects: emailId, password (old), newPassword
        if (req.getEmailId() == null) {
            throw new IllegalArgumentException("emailId is required");
        }
        if (req.getPassword() == null) {
            throw new IllegalArgumentException("old password is required");
        }
        if (req.getNewPassword() == null || req.getNewPassword().isBlank()) {
            throw new IllegalArgumentException("newPassword is required");
        }

        UserDetails user = repo.findById(req.getEmailId())
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        // check old password
        if (!user.getPassword().equals(req.getPassword())) {
            throw new WrongPasswordException("Old password is incorrect!");
        }

        user.setPassword(req.getNewPassword());
        repo.save(user);
        return new MessageResponse("Password updated successfully!");
    }

    public UserDetails getProfile(String emailId) {
        if (emailId == null) {
            throw new IllegalArgumentException("emailId is required");
        }
        return repo.findById(emailId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
    }

    public MessageResponse logout(UserRequest req) {
        if (req.getEmailId() == null) {
            throw new IllegalArgumentException("emailId is required");
        }
        if (!repo.existsById(req.getEmailId())) {
            throw new UserNotFoundException("User not found");
        }
        // nothing to change in DB for stateless logout - just respond
        return new MessageResponse("Logout successful!");
    }

}
