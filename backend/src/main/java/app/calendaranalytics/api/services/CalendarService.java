package app.calendaranalytics.api.services;

import java.io.IOException;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.google.api.services.calendar.model.CalendarListEntry;
import com.google.api.services.calendar.model.Event;
import com.google.api.services.calendar.model.EventDateTime;

import app.calendaranalytics.api.dtos.CalendarDto;
import app.calendaranalytics.api.entities.Calendar;
import app.calendaranalytics.api.entities.User;
import app.calendaranalytics.api.exception.ResourceNotFoundException;
import app.calendaranalytics.api.repositories.CalendarRepository;
import app.calendaranalytics.api.repositories.EventRepository;
import app.calendaranalytics.api.repositories.UserRepository;

/**
 * A Service class that handles business logic for the Calendar entity.
 */
@Service
public class CalendarService {

    private final UserRepository userRepository;
    // A Spring-managed Bean that provides data access methods for the Calendar
    // entity.
    private final CalendarRepository calendarRepository;

    private final GoogleCalendarService googleCalendarService;

    private final EventRepository eventRepository;

    /**
     * Constructs the CalendarService with a dependency on the
     * CalendarRepository.
     *
     * @param calendarRepository The repository responsible for Calendar data
     * access.
     */
    public CalendarService(UserRepository userRepository,
            CalendarRepository calendarRepository,
            GoogleCalendarService googleCalendarService,
            EventRepository eventRepository) {
        this.userRepository = userRepository;
        this.calendarRepository = calendarRepository;
        this.googleCalendarService = googleCalendarService;
        this.eventRepository = eventRepository;
    }

    /**
     * Queries for all calendars related to a specific User.
     *
     * @param userId The user id to query for in Supabase.
     * @return A list of CalendarDtos.
     */
    public List<CalendarDto> findCalendarsByUserId(UUID userId) {
        List<Calendar> calendars = calendarRepository.findAllByUserId(userId);
        return calendars.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    /**
     * Helper method that maps the private Calendar Entity to the public
     * CalendarDto.
     */
    private CalendarDto mapToDto(Calendar calendar) {
        CalendarDto dto = new CalendarDto();
        dto.setId(calendar.getId());
        dto.setName(calendar.getName());
        dto.setDescription(calendar.getDescription());
        dto.setColor(calendar.getColor());
        dto.setSynced(calendar.isSynced());
        return dto;
    }

    /**
     * Updates a calendar's sync status.
     *
     * @param calendarId The calendar Id to update.
     * @param userId The user to search for a matching calendar.
     * @param isSynced Whether to sync events for this calendar or not.
     * @return A CalendarDto with the updated sync status.
     * @throws ResourceNotFoundException If the calendarId is not valid, or does
     * not belong to the userId.
     */
    @Transactional
    public CalendarDto updateSyncStatus(UUID calendarId, UUID userId,
            boolean isSynced) {
        Calendar calendar = calendarRepository.findByIdAndUserId(calendarId,
                userId).orElseThrow(() -> new ResourceNotFoundException(
                "Calendar not found with id: " + calendarId));
        calendar.setSynced(isSynced);
        calendarRepository.save(calendar);
        return mapToDto(calendar);
    }

    /**
     * Fetches the related user's Google Calendars. If the calendars do not
     * already exist in the database, the calendars will be inserted.
     *
     * @param userId The user to sync calendars for.
     * @return A list of CalendarDtos that were fetched from Google Calendar.
     * @throws IOException If Google Auth library fails to refresh an access
     * token.
     * @throws ResourceNotFoundException If a user or a user's refresh token is
     * not found.
     */
    @Transactional
    public List<CalendarDto> syncCalendars(UUID userId) throws IOException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                "User not found: " + userId));
        String refreshToken = user.getGoogleRefreshToken();
        if (refreshToken == null || refreshToken.isBlank()) {
            throw new ResourceNotFoundException("User's refresh token not "
                    + "found.");
        }
        List<CalendarListEntry> googleCalendars = googleCalendarService
                .getUserCalendars(refreshToken);
        for (CalendarListEntry googleCalendar : googleCalendars) {
            Calendar calendar = calendarRepository
                    .findByGoogleCalendarIdAndUserId(googleCalendar.getId(), userId)
                    .orElseGet(() -> {
                        Calendar newCalendar = new Calendar();
                        newCalendar.setId(UUID.randomUUID());
                        return newCalendar;
                    });
            calendar.setUser(user);
            calendar.setGoogleCalendarId(googleCalendar.getId());
            calendar.setName(googleCalendar.getSummary());
            calendar.setDescription(googleCalendar.getDescription());
            calendar.setColor(googleCalendar.getBackgroundColor());
            calendar.setCreatedAt(Instant.now());
            // Save the new or updated calendar record.
            calendarRepository.save(calendar);
        }
        return findCalendarsByUserId(userId);
    }

    /**
     * Retrieves the Google calendar events related to a specified userId and
     * calendarId since the last sync and stores it in the database.
     *
     * @param calendarId The calendar Id to retrieve events for.
     * @param userId The user to search for a matching calendar.
     * @throws ResourceNotFoundException If the calendarId is not valid, or does
     * not belong to the userId, or if the refresh token is not found.
     * @throws IOException If Google Auth library fails to refresh token.
     * @throws IllegalArgumentException if at least one of the retrieved Events
     * are malformed.
     */
    @Transactional
    public void syncCalendarEvents(UUID userId, UUID calendarId) throws IOException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                "User not found: " + userId));
        String refreshToken = user.getGoogleRefreshToken();
        if (refreshToken == null || refreshToken.isBlank()) {
            throw new ResourceNotFoundException("User's refresh token not "
                    + "found.");
        }
        Calendar calendar = calendarRepository.findByIdAndUserId(calendarId,
                userId).orElseThrow(() -> new ResourceNotFoundException(
                "Calendar not found with id: " + calendarId));
        Instant lastSyncedAt = calendar.getLastSyncedAt();
        List<com.google.api.services.calendar.model.Event> googleEvents
                = googleCalendarService.getCalendarEventsSinceLastSync(
                        refreshToken, calendar.getGoogleCalendarId(),
                        lastSyncedAt);
        List<String> cancelledEventIds = googleEvents.stream()
                .filter(e -> e.getStatus().equals("cancelled"))
                .map(com.google.api.services.calendar.model.Event::getId)
                .collect(Collectors.toList());
        deleteCancelledEvents(cancelledEventIds, calendar);
        List<com.google.api.services.calendar.model.Event> eventsToUpsert
                = googleEvents.stream()
                        .filter(e -> !"cancelled".equals(e.getStatus()))
                        .collect(Collectors.toList());
        List<app.calendaranalytics.api.entities.Event> eventsToSave
                = new ArrayList<>();
        for (Event googleEvent : eventsToUpsert) {
            app.calendaranalytics.api.entities.Event newEvent
                    = initializeEvent(calendar, googleEvent);
            eventsToSave.add(newEvent);
        }
        eventRepository.saveAll(eventsToSave);
        calendar.setLastSyncedAt(Instant.now());
        calendarRepository.save(calendar);
    }

    /**
     * Deletes Events given their ids and the Calendar they belong to.
     *
     * @param cancelledEventIds A list of Event ids to delete.
     * @param calendar The Calendar the events belong to.
     */
    private void deleteCancelledEvents(List<String> cancelledEventIds,
            Calendar calendar) {
        if (!cancelledEventIds.isEmpty()) {
            List<app.calendaranalytics.api.entities.Event> eventsToDelete
                    = eventRepository
                            .findAllByGoogleEventIdInAndCalendar(cancelledEventIds,
                                    calendar);
            eventRepository.deleteAll(eventsToDelete);
        }
    }

    /**
     * Initializes an Event entity.
     *
     * @param calendar The Calendar entity related to the Event.
     * @param googleEvent A Google Calendar Event used to initialize an Event.
     * @return An initialized Event.
     */
    private app.calendaranalytics.api.entities.Event initializeEvent(
            Calendar calendar, Event googleEvent) {
        app.calendaranalytics.api.entities.Event newEvent
                = new app.calendaranalytics.api.entities.Event();
        newEvent.setId(UUID.randomUUID());
        newEvent.setCalendar(calendar);
        newEvent.setGoogleEventId(googleEvent.getId());
        newEvent.setTitle(googleEvent.getSummary());
        newEvent.setDescription(googleEvent.getDescription());
        Instant startTime = parseGoogleDateTime(googleEvent.getStart());
        Instant endTime = parseGoogleDateTime(googleEvent.getEnd());
        newEvent.setStartTime(startTime);
        newEvent.setEndTime(endTime);
        long durationInMinutes = Duration.between(startTime, endTime).toMinutes();
        newEvent.setDurationInMinutes((int) durationInMinutes);
        newEvent.setAllDay(googleEvent.getStart().getDateTime() == null);
        return newEvent;
    }

    /**
     * Parses Google's DateTime into an Instant object.
     *
     * @param eventDateTime A Google Calendar representation of an event's
     * DateTime.
     * @return eventDateTime converted to an Instant.
     * @throws IllegalArgumentException if the input is null or malformed.
     */
    private Instant parseGoogleDateTime(EventDateTime eventDateTime) {
        if (eventDateTime == null) {
            return null;
        }
        if (eventDateTime.getDateTime() != null) {
            return Instant.parse(eventDateTime.getDateTime().toStringRfc3339());
        }
        if (eventDateTime.getDate() != null) {
            return LocalDate.parse(eventDateTime.getDate().toString())
                    .atStartOfDay(ZoneOffset.UTC).toInstant();
        }
        throw new IllegalArgumentException("EventDateTime must contain either "
                + "a dateTime or date property");
    }
}
