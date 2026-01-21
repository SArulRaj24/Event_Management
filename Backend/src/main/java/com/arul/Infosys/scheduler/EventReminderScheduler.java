package com.arul.Infosys.scheduler;

import com.arul.Infosys.model.EventDetails;
import com.arul.Infosys.model.RegistrationDetails;
import com.arul.Infosys.repo.EventRepository;
import com.arul.Infosys.repo.RegistrationRepository;
import com.arul.Infosys.service.EmailService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.thymeleaf.context.Context;

import java.time.LocalDate;
import java.util.List;

@Component
public class EventReminderScheduler {

    private final EventRepository eventRepository;
    private final RegistrationRepository registrationRepository;
    private final EmailService emailService;

    public EventReminderScheduler(EventRepository eventRepository, RegistrationRepository registrationRepository, EmailService emailService) {
        this.eventRepository = eventRepository;
        this.registrationRepository = registrationRepository;
        this.emailService = emailService;
    }

    // Runs every day at 9:00 AM
    @Scheduled(cron = "0 0 9 * * *")
    public void sendReminders() {
        LocalDate today = LocalDate.now();

        // 1. Events happening in 3 days
        processReminders(today.plusDays(3), "3 Days to go!");

        // 2. Events happening in 1 day
        processReminders(today.plusDays(1), "Tomorrow!");

        // 3. Events happening today
        processReminders(today, "Today!");
    }

    private void processReminders(LocalDate eventDate, String timeMsg) {
        List<EventDetails> events = eventRepository.findByEventStartDate(eventDate);

        for (EventDetails event : events) {
            // Get all registered volunteers for this event
            List<RegistrationDetails> registrations = registrationRepository.findByEventIdAndStatus(event.getEventId(), "REGISTERED");

            for (RegistrationDetails reg : registrations) {
                Context context = new Context();
                context.setVariable("eventName", event.getEventName());
                context.setVariable("timeLeft", timeMsg);
                context.setVariable("eventDate", event.getEventStartDate().toString());
                context.setVariable("eventLocation", event.getAddress());

                emailService.sendHtmlEmail(
                        reg.getVolunteerId(),
                        "Reminder: " + event.getEventName(),
                        "reminder-template",
                        context
                );
            }
        }
    }
}