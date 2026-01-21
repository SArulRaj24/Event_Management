package com.arul.Infosys.repo;

import com.arul.Infosys.model.RegistrationDetails;
import com.arul.Infosys.model.key.RegistrationKey;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RegistrationRepository
        extends JpaRepository<RegistrationDetails, RegistrationKey> {

    Optional<RegistrationDetails>
    findByVolunteerIdAndEventId(String volunteerId, Long eventId);

    List<RegistrationDetails>
    findByEventIdAndStatus(Long eventId, String status);

    List<RegistrationDetails>
    findByEventIdAndCheckInTrue(Long eventId);
    void deleteByEventId(Long eventId);

    // --- NEW METHOD ---
    List<RegistrationDetails> findByVolunteerId(String volunteerId);

}
