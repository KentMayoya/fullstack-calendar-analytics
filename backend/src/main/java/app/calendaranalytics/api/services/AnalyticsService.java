package app.calendaranalytics.api.services;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import app.calendaranalytics.api.dtos.SummaryResponseDto;
import app.calendaranalytics.api.exception.ResourceNotFoundException;
import app.calendaranalytics.api.repositories.EventRepository;
import app.calendaranalytics.api.repositories.UserRepository;

/**
 * A Service class that handles business logic for the retrieving Analytics.
 */
@Service
public class AnalyticsService {

    private final UserRepository userRepository;
    private final EventRepository eventRepository;

    /**
     * Constructs the AnalyticsService with its dependencies.
     *
     * @param userRepository The repository responsible for User data access.
     * @param eventRepository The repository responsible for Event data access.
     */
    public AnalyticsService(UserRepository userRepository,
            EventRepository eventRepository) {
        this.userRepository = userRepository;
        this.eventRepository = eventRepository;
    }

    /**
     * Retrieves a summary of the events based on the userId, start, end,
     * calendarIds, and tagId parameters. The summary includes the total number
     * of minutes and the total number of events.
     *
     * @param userId The related user id to retrieve event analytics for.
     * @param start Start date filter.
     * @param end End date filter.
     * @param calendarIds The calendar ids to search for events.
     * @param tagId The tag id used to search for events.
     * @return A SummaryResponseDto with the total number of minutes and events.
     */
    public SummaryResponseDto getSummary(UUID userId, LocalDate start, LocalDate end,
            List<UUID> calendarIds, UUID tagId) {
        userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                "User not found: " + userId));
        // Convert LocalDates to Instants
        Instant startInstant = start.atStartOfDay(ZoneOffset.UTC).toInstant();
        Instant endInstant = end.plusDays(1).atStartOfDay(ZoneOffset.UTC)
                .toInstant();
        Long totalMinutes = eventRepository.sumDurationForUserFilteredByTag(
                userId, startInstant, endInstant, calendarIds, tagId);
        Long totalEvents = eventRepository.countEventsForUserFilteredByTag(
                userId, startInstant, endInstant, calendarIds, tagId);
        SummaryResponseDto summary = new SummaryResponseDto();
        summary.setTotalMinutes(totalMinutes == null ? 0 : totalMinutes);
        summary.setTotalEvents(totalEvents == null ? 0 : totalEvents);
        return summary;
    }
}
