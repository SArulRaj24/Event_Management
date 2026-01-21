package com.arul.Infosys.service;

import com.arul.Infosys.dto.*;

import java.util.List;

public interface EventService {

    Long createEvent(EventCreateRequestDTO dto, String creatorEmail);

    Long updateEvent(EventUpdateRequestDTO dto);

    List<EventResponseDTO> listEventsByType(String type);

    EventResponseDTO getEventById(Long eventId);

    void deleteEvent(Long eventId);

    String submitFeedback(FeedbackDTO feedbackDTO);

    String registerEvent(Long eventId, String emailId);

    String unregisterEvent(Long eventId, String emailId);

    String checkIn(Long eventId, String emailId);

    EventParticipantsResponse getRegistrations(Long eventId);

    EventParticipantsResponse getParticipants(Long eventId);

    List<Long> getRegisteredEventIds(String emailId);

    EventAnalyticsDTO getEventAnalytics(Long eventId);
}
