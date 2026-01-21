//package com.arul.Infosys.service;
//
//import com.arul.Infosys.exception.NotLoggedInException;
//import com.arul.Infosys.exception.SessionExpiredException;
//import com.arul.Infosys.exception.UserNotFoundException;
//import com.arul.Infosys.model.UserDetails;
//import com.arul.Infosys.model.UserSession;
//import com.arul.Infosys.repo.UserDetailsRepository;
//import com.arul.Infosys.repo.UserSessionRepository;
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.servlet.http.HttpSession;
//import org.springframework.stereotype.Service;
//
//import java.time.LocalDateTime;
//import java.util.List;
//import java.util.Optional;
//
//@Service
//public class SessionService {
//
//    private final UserSessionRepository sessionRepo;
//    private final UserDetailsRepository userRepo;
//
//    // Session valid for 30mins
//    private static final long SESSION_TTL_MINUTES = 30;
//    public static final String AUTH_HEADER = "X-Auth-Token";
//
//    public SessionService(UserSessionRepository sessionRepo, UserDetailsRepository userRepo) {
//        this.sessionRepo = sessionRepo;
//        this.userRepo = userRepo;
//    }
//
//    // Create session and Return the ID string
//    public String createSession(HttpSession httpSession, String emailId) {
//        String sid = httpSession.getId(); // We still use the Container's ID generation for convenience
//        UserSession s = new UserSession();
//        s.setSessionId(sid);
//        s.setEmailId(emailId);
//        s.setExpiresAt(LocalDateTime.now().plusMinutes(SESSION_TTL_MINUTES));
//        s.setActive(true);
//        sessionRepo.save(s);
//        return sid; // Return ID so Controller can send it to Frontend
//    }
//
//    // Helper: Try to get ID from Header first, then Cookie (HttpSession)
//    public String getSessionIdFromRequest(HttpServletRequest req) {
//        // 1. Check Header (For Frontend/Mobile clients)
//        String headerToken = req.getHeader(AUTH_HEADER);
//        if (headerToken != null && !headerToken.isBlank()) {
//            return headerToken;
//        }
//
//        // 2. Check Standard Cookie (For Postman/Browser default)
//        HttpSession session = req.getSession(false);
//        return (session != null) ? session.getId() : null;
//    }
//
//    // Main validation logic
//    public boolean isSessionValid(String sessionId) {
//        if (sessionId == null || sessionId.isBlank()) return false;
//
//        return sessionRepo.findById(sessionId)
//                .map(sess -> {
//                    if (!sess.isActive()) return false;
//                    if (sess.getExpiresAt().isBefore(LocalDateTime.now())) {
//                        sess.setActive(false);
//                        sessionRepo.save(sess);
//                        return false;
//                    }
//                    return true;
//                }).orElse(false);
//    }
//
//    // Refactored: Takes Request, extracts ID, returns User
//    public UserDetails getLoggedInUser(HttpServletRequest req) {
//        String sid = getSessionIdFromRequest(req);
//
//        if (sid == null) {
//            throw new NotLoggedInException("No active session found. Missing Token or Cookie.");
//        }
//
//        UserSession sess = sessionRepo.findById(sid)
//                .orElseThrow(() -> new NotLoggedInException("Session not found. Please login."));
//
//        if (!sess.isActive()) throw new NotLoggedInException("Session inactive.");
//
//        if (sess.getExpiresAt().isBefore(LocalDateTime.now())) {
//            sess.setActive(false);
//            sessionRepo.save(sess);
//            throw new SessionExpiredException("Session expired.");
//        }
//
//        // Return full User object
//        return userRepo.findById(sess.getEmailId())
//                .orElseThrow(() -> new UserNotFoundException("User associated with session not found."));
//    }
//
//    public void logoutByEmail(String emailId) {
//        List<UserSession> sessions = sessionRepo.findByEmailId(emailId);
//        sessions.forEach(s -> {
//            s.setActive(false);
//            s.setExpiresAt(LocalDateTime.now());
//        });
//        sessionRepo.saveAll(sessions);
//    }
//}

package com.arul.Infosys.service;

import com.arul.Infosys.exception.NotLoggedInException;
import com.arul.Infosys.exception.SessionExpiredException;
import com.arul.Infosys.exception.UserNotFoundException;
import com.arul.Infosys.model.UserDetails;
import com.arul.Infosys.model.UserSession;
import com.arul.Infosys.repo.UserDetailsRepository;
import com.arul.Infosys.repo.UserSessionRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SessionService {

    private final UserSessionRepository sessionRepo;
    private final UserDetailsRepository userRepo;

    // 1. SET TIMEOUT TO 30 MINUTES
    private static final long SESSION_TTL_MINUTES = 30;
    public static final String AUTH_HEADER = "X-Auth-Token";

    public SessionService(UserSessionRepository sessionRepo, UserDetailsRepository userRepo) {
        this.sessionRepo = sessionRepo;
        this.userRepo = userRepo;
    }

    public String createSession(HttpSession httpSession, String emailId) {
        String sid = httpSession.getId();
        UserSession s = new UserSession();
        s.setSessionId(sid);
        s.setEmailId(emailId);
        // Set initial expiry
        s.setExpiresAt(LocalDateTime.now().plusMinutes(SESSION_TTL_MINUTES));
        s.setActive(true);
        sessionRepo.save(s);
        return sid;
    }

    public String getSessionIdFromRequest(HttpServletRequest req) {
        String headerToken = req.getHeader(AUTH_HEADER);
        if (headerToken != null && !headerToken.isBlank()) {
            return headerToken;
        }
        HttpSession session = req.getSession(false);
        return (session != null) ? session.getId() : null;
    }

    public boolean isSessionValid(String sessionId) {
        if (sessionId == null || sessionId.isBlank()) return false;

        return sessionRepo.findById(sessionId)
                .map(sess -> {
                    if (!sess.isActive()) return false;

                    if (sess.getExpiresAt().isBefore(LocalDateTime.now())) {
                        sess.setActive(false);
                        sessionRepo.save(sess);
                        return false;
                    }

                    // 2. SLIDING WINDOW: Extend session if active
                    sess.setExpiresAt(LocalDateTime.now().plusMinutes(SESSION_TTL_MINUTES));
                    sessionRepo.save(sess);

                    return true;
                }).orElse(false);
    }

    public UserDetails getLoggedInUser(HttpServletRequest req) {
        String sid = getSessionIdFromRequest(req);

        if (sid == null) {
            throw new NotLoggedInException("No active session found. Missing Token or Cookie.");
        }

        UserSession sess = sessionRepo.findById(sid)
                .orElseThrow(() -> new NotLoggedInException("Session not found. Please login."));

        if (!sess.isActive()) throw new NotLoggedInException("Session inactive.");

        if (sess.getExpiresAt().isBefore(LocalDateTime.now())) {
            sess.setActive(false);
            sessionRepo.save(sess);
            throw new SessionExpiredException("Session expired.");
        }

        // 3. SLIDING WINDOW: Extend session here too
        sess.setExpiresAt(LocalDateTime.now().plusMinutes(SESSION_TTL_MINUTES));
        sessionRepo.save(sess);

        return userRepo.findById(sess.getEmailId())
                .orElseThrow(() -> new UserNotFoundException("User associated with session not found."));
    }

    public void logoutByEmail(String emailId) {
        List<UserSession> sessions = sessionRepo.findByEmailId(emailId);
        sessions.forEach(s -> {
            s.setActive(false);
            s.setExpiresAt(LocalDateTime.now()); // Expire immediately
        });
        sessionRepo.saveAll(sessions);
    }
}