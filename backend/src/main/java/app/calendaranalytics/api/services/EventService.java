package app.calendaranalytics.api.services;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import app.calendaranalytics.api.dtos.EventDto;
import app.calendaranalytics.api.dtos.TagDto;
import app.calendaranalytics.api.entities.Event;
import app.calendaranalytics.api.entities.EventTag;
import app.calendaranalytics.api.entities.Tag;
import app.calendaranalytics.api.entities.User;
import app.calendaranalytics.api.exception.ResourceNotFoundException;
import app.calendaranalytics.api.repositories.EventRepository;
import app.calendaranalytics.api.repositories.EventTagRepository;
import app.calendaranalytics.api.repositories.TagRepository;
import app.calendaranalytics.api.repositories.UserRepository;

/**
 * A Service class that handles business logic for the Event entity.
 */
@Service
public class EventService {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final TagRepository tagRepository;
    private final EventTagRepository eventTagRepository;

    /**
     * Constructs the EventService with a dependency on the EventRepository.
     *
     * @param eventRepository The repository responsible for event data access.
     * @param userRepository The repository responsible for user data access.
     * @param tagRepository The repository responsible for event data access.
     * @param eventTagRepository The repository responsible for event tag data
     * access.
     */
    public EventService(EventRepository eventRepository,
            UserRepository userRepository,
            TagRepository tagRepository,
            EventTagRepository eventTagRepository) {
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
        this.tagRepository = tagRepository;
        this.eventTagRepository = eventTagRepository;
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
        List<Event> events = eventRepository
                .findEventsForUserByCalendarIdsAndDateRange(userId,
                        calendarIds, start, end);
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

    /**
     * Updates the tags related to a user's event.
     *
     * @param userId The user id the event and tags belongs to.
     * @param eventId The event id to relate tags to.
     * @param tagIds A list of tags to relate to the event.
     * @throws ResourceNotFoundException If any user, event, or tag is not
     * found.
     */
    @Transactional
    public void updateEventTags(UUID userId, UUID eventId, List<UUID> tagIds) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not "
                + "found: " + userId));
        // Validate that the event belongs to the current user
        Event event = eventRepository.findByUserIdAndId(userId, eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event with id "
                + eventId + " not found for user id " + userId));
        if (tagIds == null || tagIds.isEmpty()) {
            eventTagRepository.deleteByEvent(event);
            return;
        }
        List<Tag> tags = tagRepository.findAllByUserAndIdIn(user, tagIds);
        if (tags.size() != tagIds.size()) {
            throw new ResourceNotFoundException("One or more tags not found.");
        }
        eventTagRepository.deleteByEvent(event);
        List<EventTag> newEventTags = tags.stream().map(tag -> {
            EventTag eventTag = new EventTag();
            eventTag.setEvent(event);
            eventTag.setTag(tag);
            return eventTag;
        }).collect(Collectors.toList());
        eventTagRepository.saveAll(newEventTags);
    }

    /**
     * Returns a list of TagDtos that are related to the specific event.
     *
     * @param userId The user id the event belongs to.
     * @param eventId The event id to find related tags.
     * @return A list of TagDtos that are related to the specified event.
     */
    public List<TagDto> getEventTags(UUID userId, UUID eventId) {
        // Validate that the event belongs to the current user
        eventRepository.findByUserIdAndId(userId, eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event with id "
                + eventId + " not found for user id " + userId));
        List<Tag> tags = tagRepository.findAllByEventId(eventId);
        return tags.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    /**
     * Helper method that maps the private Tag Entity to the public TagDto.
     *
     * @param tagEntity The Tag entity to convert.
     */
    private TagDto mapToDto(Tag tagEntity) {
        TagDto dto = new TagDto();
        dto.setId(tagEntity.getId());
        dto.setName(tagEntity.getName());
        return dto;
    }
}
