package com.arul.Infosys.controller;

import com.arul.Infosys.dto.LoginResponseDTO;
import com.arul.Infosys.dto.MessageResponse;
import com.arul.Infosys.dto.UserRequest;
import com.arul.Infosys.model.UserDetails;
import com.arul.Infosys.service.SessionService;
import com.arul.Infosys.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class UserController {

    private final UserService userService;
    private final SessionService sessionService;

    public UserController(UserService userService, SessionService sessionService) {
        this.userService = userService;
        this.sessionService = sessionService;
    }

    @PostMapping("/register")
    public ResponseEntity<MessageResponse> register(@RequestBody UserRequest req) {
        return ResponseEntity.ok(userService.register(req));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserRequest req, HttpServletRequest request) {
        // 1. Authenticate credentials
        UserDetails user = userService.login(req);

        // 2. Create new HTTP Session (invalidating old one if exists ensures clean state)
        HttpSession oldSession = request.getSession(false);
        if (oldSession != null) oldSession.invalidate();

        // 3. Create Session and get the ID (Token)
        String sessionId = sessionService.createSession(request.getSession(true), user.getEmailId());

        // 4. Return Token in the Response Body
        return ResponseEntity.ok(new LoginResponseDTO(
                "Login Successful",
                sessionId,       // <--- The Frontend will save this
                user.getEmailId(),
                user.getRole()
        ));
    }

    @PostMapping("/logout")
    public ResponseEntity<MessageResponse> logout(HttpServletRequest request) {
        // Use the new service method that checks Header or Cookie
        try {
            // Retrieve user first to know who to logout in DB
            UserDetails user = sessionService.getLoggedInUser(request);
            sessionService.logoutByEmail(user.getEmailId());
        } catch (Exception ignored) {
            // Session might already be invalid/expired, just proceed to invalidate HttpSession
        }

        // Invalidate container session if it exists
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }

        return ResponseEntity.ok(new MessageResponse("Logged out successfully"));
    }

    @PutMapping("/update")
    public ResponseEntity<MessageResponse> update(@RequestBody UserRequest req, HttpServletRequest request) {
        // REFACTORED: Now passes the whole 'request' to check for X-Auth-Token header
        UserDetails currentUser = sessionService.getLoggedInUser(request);

        if (!currentUser.getEmailId().equals(req.getEmailId())) {
            return ResponseEntity.status(403).body(new MessageResponse("Unauthorized: Cannot update another user's profile"));
        }
        return ResponseEntity.ok(userService.update(req));
    }

    @PutMapping("/resetPassword")
    public ResponseEntity<MessageResponse> resetPassword(@RequestBody UserRequest req, HttpServletRequest request) {
        // REFACTORED: Checks Header or Cookie
        UserDetails currentUser = sessionService.getLoggedInUser(request);

        if (!currentUser.getEmailId().equals(req.getEmailId())) {
            return ResponseEntity.status(403).body(new MessageResponse("Unauthorized: Cannot reset another user's password"));
        }
        return ResponseEntity.ok(userService.resetPassword(req));
    }

    @GetMapping("/profile")
    public ResponseEntity<?> profile(@RequestParam String emailId, HttpServletRequest request) {
        // REFACTORED: Checks Header or Cookie
        UserDetails currentUser = sessionService.getLoggedInUser(request);

        if (!currentUser.getEmailId().equals(emailId)) {
            return ResponseEntity.status(403).body(new MessageResponse("Unauthorized: Cannot view another user's profile"));
        }
        return ResponseEntity.ok(userService.getProfile(emailId));
    }
}