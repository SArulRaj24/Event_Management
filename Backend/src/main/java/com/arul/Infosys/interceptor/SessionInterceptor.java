//package com.arul.Infosys.interceptor;
//
//import com.arul.Infosys.exception.NotLoggedInException;
//import com.arul.Infosys.service.SessionService;
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.servlet.http.HttpServletResponse;
//import org.springframework.stereotype.Component;
//import org.springframework.web.servlet.HandlerInterceptor;
//
//@Component
//public class SessionInterceptor implements HandlerInterceptor {
//
//    private final SessionService sessionService;
//
//    public SessionInterceptor(SessionService sessionService) {
//        this.sessionService = sessionService;
//    }
//
//    @Override
//    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
//
//        String path = request.getRequestURI();
//
//        // 1. Public Endpoints
//        if (path.startsWith("/user/login") || path.startsWith("/user/register")) {
//            return true;
//        }
//
//        // 2. Extract Token/ID using the Service logic (Header OR Cookie)
//        String sessionId = sessionService.getSessionIdFromRequest(request);
//
//        if (sessionId == null) {
//            throw new NotLoggedInException("Access Denied: No session token provided in Header (X-Auth-Token) or Cookie.");
//        }
//
//        // 3. Validate
//        if (!sessionService.isSessionValid(sessionId)) {
//            throw new NotLoggedInException("Access Denied: Session Invalid or Expired.");
//        }
//
//        return true;
//    }
//}

package com.arul.Infosys.interceptor;

import com.arul.Infosys.exception.NotLoggedInException;
import com.arul.Infosys.service.SessionService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class SessionInterceptor implements HandlerInterceptor {

    private final SessionService sessionService;

    public SessionInterceptor(SessionService sessionService) {
        this.sessionService = sessionService;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {

        // ============================================================
        // CRITICAL FIX: Allow Preflight (OPTIONS) requests
        // ============================================================
        // Browsers send this "test" request first without the Token.
        // We must allow it so the browser knows it's safe to send the real request.
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            return true;
        }
        // ============================================================

        String path = request.getRequestURI();

        // 1. Public Endpoints (No Auth Required)
        if (path.startsWith("/user/login") || path.startsWith("/user/register")) {
            return true;
        }

        // 2. Extract Token/ID using the Service logic (Header OR Cookie)
        String sessionId = sessionService.getSessionIdFromRequest(request);

        if (sessionId == null) {
            throw new NotLoggedInException("Access Denied: No session token provided in Header (X-Auth-Token) or Cookie.");
        }

        // 3. Validate
        if (!sessionService.isSessionValid(sessionId)) {
            throw new NotLoggedInException("Access Denied: Session Invalid or Expired.");
        }

        return true;
    }
}