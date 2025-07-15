package app.calendaranalytics.api.services;

import java.io.IOException;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.google.api.services.calendar.model.CalendarListEntry;

import app.calendaranalytics.api.dtos.CalendarDto;
import app.calendaranalytics.api.entities.Calendar;
import app.calendaranalytics.api.entities.User;
import app.calendaranalytics.api.exception.ResourceNotFoundException;
import app.calendaranalytics.api.repositories.CalendarRepository;
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

    /**
     * Constructs the CalendarService with a dependency on the
     * CalendarRepository.
     *
     * @param calendarRepository The repository responsible for Calendar data
     * access.
     */
    public CalendarService(UserRepository userRepository,
            CalendarRepository calendarRepository,
            GoogleCalendarService googleCalendarService) {
        this.userRepository = userRepository;
        this.calendarRepository = calendarRepository;
        this.googleCalendarService = googleCalendarService;
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
}
