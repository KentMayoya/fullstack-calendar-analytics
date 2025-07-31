package app.calendaranalytics.api.controllers;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import app.calendaranalytics.api.dtos.EventDto;
import app.calendaranalytics.api.dtos.TagDto;
import app.calendaranalytics.api.dtos.UpdateEventTagsRequestDto;
import app.calendaranalytics.api.exception.ResourceNotFoundException;
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
     * @param eventService The service managing event-related business logic.
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

    /**
     * Updates all the event tags related to an event with the tags in the
     * requestDto.
     *
     * @param eventId The event whose tags will be updated.
     * @param requestDto A JSON containing a list of tag ids to relate to the
     * event.
     * @param authentication An object provided by the Spring Security
     * framework. Contains all the information regarding the currently logged-in
     * user.
     * @throws ResourceNotFoundException If any user, event, or tag is not
     * found.
     */
    @PutMapping("/{eventId}/tags")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void updateEventTags(@PathVariable UUID eventId,
            @RequestBody UpdateEventTagsRequestDto requestDto,
            Authentication authentication) {
        UUID userId = UUID.fromString(authentication.getName());
        eventService.updateEventTags(userId, eventId, requestDto.getTagIds());
    }

    /**
     * Retrieves a list of TagDtos related to an event that belongs to a
     * specific user (defined in Authentication).
     *
     * @param eventId The event whose tags will be retrieved.
     * @param authentication An object provided by the Spring Security
     * framework. Contains all the information regarding the currently logged-in
     * user.
     * @return A 200 OK with a list of TagDtos related to the specified event.
     */
    @GetMapping("/{eventId}/tags")
    @ResponseStatus(HttpStatus.OK)
    public List<TagDto> getEventTags(@PathVariable UUID eventId,
            Authentication authentication) {
        UUID userId = UUID.fromString(authentication.getName());
        return eventService.getEventTags(userId, eventId);
    }
}
