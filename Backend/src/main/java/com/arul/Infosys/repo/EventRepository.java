package com.arul.Infosys.repo;

import com.arul.Infosys.model.EventDetails;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface EventRepository extends JpaRepository<EventDetails, Long> {

    List<EventDetails> findByEventStartDateAfter(LocalDate date);

    List<EventDetails> findByEventStartDateLessThanEqualAndEventEndDateGreaterThanEqual(
            LocalDate start, LocalDate end);

    List<EventDetails> findByEventEndDateBefore(LocalDate date);
    List<EventDetails> findByEventStartDate(LocalDate date);
}
