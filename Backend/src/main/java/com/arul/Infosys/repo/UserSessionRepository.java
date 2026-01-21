package com.arul.Infosys.repo;

import com.arul.Infosys.model.UserSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserSessionRepository extends JpaRepository<UserSession, String> {
    // findById(sessionId) inherited
    List<UserSession> findByEmailId(String emailId);

}
