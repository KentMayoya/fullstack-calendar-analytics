package app.calendaranalytics.api.controllers;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import app.calendaranalytics.api.dtos.CalendarDto;
import app.calendaranalytics.api.dtos.UpdateCalendarDto;
import app.calendaranalytics.api.exception.ResourceNotFoundException;
import app.calendaranalytics.api.services.CalendarService;

/**
 * Defines the API endpoint for retrieving the user's details from Supabase.
 */
@RestController
@RequestMapping("/api/v1/calendars")
public class CalendarController {

    // A Spring-managed Bean that provides data access methods for the Calendar
    // entity.
    private final CalendarService calendarService;
    private final String secretCronKey;

    /**
     * Constructs the CalendarController with a dependency on the
     * CalendarService.
     *
     * @param calendarService The service managing calendar-related business
     * logic.
     */
    public CalendarController(CalendarService calendarService,
            @Value("${cron.secret-key}") String secretCronKey) {
        this.calendarService = calendarService;
        this.secretCronKey = secretCronKey;
    }

    /**
     * Retrieves a list of calendars belonging to the authenticated user from
     * Supabase using the current session.
     *
     * @param authentication An object provided by the Spring Security
     * framework. Contains all the information regarding the currently logged-in
     * user.
     * @return A list of CalendarDtos and 200 OK response.
     */
    @GetMapping
    public ResponseEntity<List<CalendarDto>> getUserCalendars(
            Authentication authentication) {
        UUID userId = UUID.fromString(authentication.getName());
        List<CalendarDto> calendars = calendarService.findCalendarsByUserId(userId);
        return ResponseEntity.ok(calendars);
    }

    /**
     * Updates the specified calendar's sync status.
     *
     * @param calendarId The specified calendar's UUID.
     * @param updateDto The calendar columns to update.
     * @param authentication An object provided by the Spring Security
     * framework. Contains all the information regarding the currently logged-in
     * user.
     * @return A CalendarDto containing the updated fields and 200 OK response.
     */
    @PutMapping("/{calendarId}")
    public ResponseEntity<CalendarDto> updateCalendar(@PathVariable UUID calendarId,
            @RequestBody UpdateCalendarDto updateDto, Authentication authentication) {
        UUID userId = UUID.fromString(authentication.getName());
        CalendarDto updatedCalendar = calendarService.updateSyncStatus(
                calendarId, userId, updateDto.isSynced());
        return ResponseEntity.ok(updatedCalendar);
    }

    /**
     * Fetches the related user's Google Calendars. If the calendars do not
     * already exist in the database, the calendars will be inserted.
     *
     * @param authentication An object provided by the Spring Security
     * framework. Contains all the information regarding the currently logged-in
     * user.
     * @return A list of CalendarDtos and 200 OK response.
     * @throws IOException If Google Auth library fails to refresh an access
     * token.
     * @throws ResourceNotFoundException If a user or a user's refresh token is
     * not found.
     */
    @PostMapping("/sync")
    public ResponseEntity<List<CalendarDto>> getGoogleCalendars(
            Authentication authentication) throws IOException {
        UUID userId = UUID.fromString(authentication.getName());
        List<CalendarDto> updatedCalendars = calendarService.syncCalendars(userId);
        return ResponseEntity.ok(updatedCalendars);
    }

    /**
     * Fetches and updates all Google Calendar Events for a specified Google
     * Calendar since the calendar's last sync date and time.
     *
     * @param calendarId The specified calendar's UUID.
     * @param authentication An object provided by the Spring Security
     * framework. Contains all the information regarding the currently logged-in
     * user.
     * @throws IOException If Google Auth library fails to refresh token.
     * @throws IllegalArgumentException if at least one of the retrieved Events
     * are malformed.
     */
    @PostMapping("/{calendarId}/sync")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void syncCalendarEvents(@PathVariable UUID calendarId,
            Authentication authentication) throws IOException {
        UUID userId = UUID.fromString(authentication.getName());
        calendarService.syncCalendarEvents(userId, calendarId);
    }

    /**
     * Syncs the events since the last sync date/time for all users with
     * calendars that are marked as synced. Requires a secret key to perform the
     * sync.
     *
     * @param requestKey The secret key to authorize the sync job.
     * @throws IllegalArgumentException if the key in the is incorrect.
     */
    @PostMapping("/sync-all")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public void syncAllCalendarEvents(
            @RequestHeader("X-Cron-Secret") String requestKey) {
        if (!requestKey.equals(this.secretCronKey)) {
            throw new IllegalArgumentException("Invalid or missing secret.");
        }
        calendarService.syncAllCalendarEvents();
    }

    /**
     * Deletes all Events related to the specified calendarId in the database
     * for the current user.
     *
     * @param calendarId The specified calendar's UUID.
     * @param authentication An object provided by the Spring Security
     * framework. Contains all the information regarding the currently logged-in
     * user.
     * @throws ResourceNotFoundException If the calendarId is not valid, or does
     * not belong to the userId.
     */
    @DeleteMapping("/{calendarId}/events")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void unsyncCalendarEvents(@PathVariable UUID calendarId,
            Authentication authentication) {
        UUID userId = UUID.fromString(authentication.getName());
        calendarService.unsyncCalendarEvents(userId, calendarId);
    }
}
