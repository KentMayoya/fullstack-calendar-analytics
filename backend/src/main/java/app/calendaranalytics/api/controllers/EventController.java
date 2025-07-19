package app.calendaranalytics.api.controllers;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import app.calendaranalytics.api.dtos.EventDto;
import app.calendaranalytics.api.services.EventService;

@RestController
@RequestMapping("/api/v1/events")
public class EventController {

    // A Spring-managed Bean that provides business logic methods for the Event
    // entity.
    private final EventService eventService;

    /**
     * Constructs the EventController with a dependency on the EventService.
     *
     * @param userService The service managing event-related business logic.
     */
    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    /**
     * Queries for all events that to a user (defined in Authentication), whose
     * calendar Id is included in calendarIds, and whose events fall within the
     * start and end range.
     *
     * @param start The start date/time for the queried events.
     * @param end The end date/time for the queried events.
     * @param calendarIds The list of calendarIds the events belong to.
     * @param authentication An object provided by the Spring Security
     * framework. Contains all the information regarding the currently logged-in
     * user.
     */
    @GetMapping
    public ResponseEntity<List<EventDto>> getEvents(
            @RequestParam("start") Instant start,
            @RequestParam("end") Instant end,
            @RequestParam("calendarIds") List<UUID> calendarIds,
            Authentication authentication
    ) {
        UUID userId = UUID.fromString(authentication.getName());
        List<EventDto> events = eventService.findEventsByDateRange(userId,
                calendarIds, start, end);
        return ResponseEntity.ok(events);
    }
}
