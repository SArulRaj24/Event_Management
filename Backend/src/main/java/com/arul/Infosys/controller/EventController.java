package com.arul.Infosys.controller;

import com.arul.Infosys.dto.*;
import com.arul.Infosys.model.UserDetails;
import com.arul.Infosys.service.EventService;
import com.arul.Infosys.service.SessionService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/event")
public class EventController {

    private final EventService service;
    private final SessionService sessionService;

    public EventController(EventService service, SessionService sessionService) {
        this.service = service;
        this.sessionService = sessionService;
    }

    // --- REFACTORED HELPERS ---

    // Pass the whole Request to the service to check Header/Cookie
    private UserDetails getAuthenticatedUser(HttpServletRequest req) {
        return sessionService.getLoggedInUser(req);
    }

    private UserDetails validateRole(HttpServletRequest req, String requiredRole) {
        UserDetails user = getAuthenticatedUser(req);
        if (!user.getRole().equalsIgnoreCase(requiredRole)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied: Requires " + requiredRole + " role.");
        }
        return user;
    }
    // --------------------------

    /* ================= ORGANIZER ONLY ENDPOINTS ================= */

    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody EventCreateRequestDTO dto, HttpServletRequest req) {
        UserDetails user = validateRole(req, "ORGANIZER");
        Long id = service.createEvent(dto, user.getEmailId());
        return ResponseEntity.ok(Map.of("Status", "created", "eventId", id));
    }

    @PutMapping("/update")
    public ResponseEntity<?> update(@RequestBody EventUpdateRequestDTO dto, HttpServletRequest req) {
        validateRole(req, "ORGANIZER");
        Long id = service.updateEvent(dto);
        return ResponseEntity.ok(Map.of("Status", "updated", "eventId", id));
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> delete(@RequestParam Long eventId, HttpServletRequest req) {
        validateRole(req, "ORGANIZER");
        service.deleteEvent(eventId);
        return ResponseEntity.ok(Map.of("Status", "deleted successfully"));
    }

    @GetMapping("/{eventId}/participants")
    public ResponseEntity<?> participants(@PathVariable Long eventId, HttpServletRequest req) {
        validateRole(req, "ORGANIZER");
        return ResponseEntity.ok(service.getParticipants(eventId));
    }

    @GetMapping("/{eventId}/registrations")
    public ResponseEntity<?> registrations(@PathVariable Long eventId, HttpServletRequest req) {
        validateRole(req, "ORGANIZER");
        return ResponseEntity.ok(service.getRegistrations(eventId));
    }

    /* ================= VOLUNTEER ONLY ENDPOINTS ================= */

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegistrationRequest dto, HttpServletRequest req) {
        UserDetails user = validateRole(req, "VOLUNTEER");
        if(!user.getEmailId().equals(dto.getEmailId())) {
            return ResponseEntity.status(403).body(Map.of("error", "Cannot register for another user"));
        }
        String result = service.registerEvent(dto.getEventId(), user.getEmailId());
        return ResponseEntity.ok(Map.of("status", result));
    }

    @PostMapping("/unregister")
    public ResponseEntity<?> unregister(@RequestBody RegistrationRequest dto, HttpServletRequest req) {
        UserDetails user = validateRole(req, "VOLUNTEER");
        String result = service.unregisterEvent(dto.getEventId(), user.getEmailId());
        return ResponseEntity.ok(Map.of("status", result));
    }

    /* ================= SHARED / CONDITIONAL ENDPOINTS ================= */

    @GetMapping("/list")
    public ResponseEntity<?> list(@RequestParam String type, HttpServletRequest req) {
        UserDetails user = getAuthenticatedUser(req);

//        if ("VOLUNTEER".equalsIgnoreCase(user.getRole())) {
//            if (!"ongoing".equalsIgnoreCase(type)) {
//                return ResponseEntity.status(403)
//                        .body(Map.of("error", "Volunteers can only view 'ongoing' events."));
//            }
//        }
        List<EventResponseDTO> events = service.listEventsByType(type);
        return ResponseEntity.ok(events);
    }

    @GetMapping("/{eventId}")
    public ResponseEntity<EventResponseDTO> get(@PathVariable Long eventId, HttpServletRequest req) {
        getAuthenticatedUser(req);
        return ResponseEntity.ok(service.getEventById(eventId));
    }

    @PostMapping("/feedback")
    public ResponseEntity<?> feedback(@RequestBody FeedbackDTO dto, HttpServletRequest req) {
        getAuthenticatedUser(req);
        return ResponseEntity.ok(Map.of("Status", "success", "Message", service.submitFeedback(dto)));
    }

    @PostMapping("/checkin")
    public ResponseEntity<?> checkIn(@RequestBody RegistrationRequest dto, HttpServletRequest req) {
        UserDetails user = getAuthenticatedUser(req);

        if ("VOLUNTEER".equalsIgnoreCase(user.getRole())) {
            if (dto.getEmailId() != null && !user.getEmailId().equals(dto.getEmailId())) {
                return ResponseEntity.status(403).body(Map.of("error", "Unauthorized: You cannot check in another user."));
            }
            dto.setEmailId(user.getEmailId());
        }
        String result = service.checkIn(dto.getEventId(), dto.getEmailId());
        return ResponseEntity.ok(Map.of("status", result));
    }

    // --- NEW ENDPOINT  FOR GET THE REGISTERED ---
    @GetMapping("/my-registrations")
    public ResponseEntity<?> getMyRegistrations(HttpServletRequest req) {
        UserDetails user = getAuthenticatedUser(req);
        return ResponseEntity.ok(service.getRegisteredEventIds(user.getEmailId()));
    }

//    ANALAYTICS

    @GetMapping("/{eventId}/analytics")
    public ResponseEntity<EventAnalyticsDTO> getAnalytics(@PathVariable Long eventId, HttpServletRequest req) {
        getAuthenticatedUser(req); // Ensure logged in
        return ResponseEntity.ok(service.getEventAnalytics(eventId));
    }
}