package app.calendaranalytics.api.services;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import app.calendaranalytics.api.dtos.EventDto;
import app.calendaranalytics.api.entities.Event;
import app.calendaranalytics.api.repositories.EventRepository;

/**
 * A Service class that handles business logic for the Event entity.
 */
@Service
public class EventService {

    // A Spring-managed Bean that provides data access methods for the User entity.
    private final EventRepository eventRepository;

    /**
     * Constructs the EventService with a dependency on the EventRepository.
     *
     * @param eventRepository The repository responsible for event data access.
     */
    public EventService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    /**
     * Retrieves a list of EventDtos that belong to a user, whose calendar Id is
     * included in calendarIds, and whose events fall within the start and end
     * range.
     *
     * @param userId The user the events belong to.
     * @param calendarIds The list of calendarIds the events belong to.
     * @param start The start date/time for the queried events.
     * @param end The end date/time for the queried events.
     * @return A list of EventDtos that satisfy the user, calendar, and date
     * range.
     */
    public List<EventDto> findEventsByDateRange(UUID userId,
            List<UUID> calendarIds, Instant start, Instant end) {

        System.out.println("Backend received Start Time (UTC): " + start);
        System.out.println("Backend received End Time (UTC): " + end);
        System.out.println("userId is: " + userId);
        System.out.println("calendarIds are: " + calendarIds);
        List<Event> events = eventRepository
                .findEventsForUserByCalendarIdsAndDateRange(userId,
                        calendarIds, start, end);

        System.out.println("Database query found " + events.size() + " events.");

        return events.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    /**
     * Helper method that maps the private Event Entity to the public EventDto.
     *
     * @param eventEntity The Event entity to convert.
     */
    private EventDto mapToDto(Event eventEntity) {
        EventDto dto = new EventDto();
        dto.setId(eventEntity.getId());
        dto.setCalendarId(eventEntity.getCalendar().getId());
        dto.setTitle(eventEntity.getTitle());
        dto.setDescription(eventEntity.getDescription());
        dto.setStartTime(eventEntity.getStartTime());
        dto.setEndTime(eventEntity.getEndTime());
        dto.setAllDay(eventEntity.isAllDay());
        dto.setDurationInMinutes(eventEntity.getDurationInMinutes());
        dto.setColor(eventEntity.getCalendar().getColor());
        return dto;
    }
}
