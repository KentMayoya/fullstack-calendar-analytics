package app.calendaranalytics.api.controllers;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import app.calendaranalytics.api.dtos.CalendarDto;
import app.calendaranalytics.api.dtos.UpdateCalendarDto;
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

    /**
     * Constructs the CalendarController with a dependency on the
     * CalendarService.
     *
     * @param calendarService The service managing calendar-related business
     * logic.
     */
    public CalendarController(CalendarService calendarService) {
        this.calendarService = calendarService;
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
     * @param updateDto
     * @param authentication An object provided by the Spring Security
     * framework. Contains all the information regarding the currently logged-in
     * user.
     * @return A CalendarDto containing the updated fields.
     */
    @PutMapping("/{calendarId}")
    public ResponseEntity<CalendarDto> updateCalendar(@PathVariable UUID calendarId,
            @RequestBody UpdateCalendarDto updateDto, Authentication authentication) {
        UUID userId = UUID.fromString(authentication.getName());
        CalendarDto updatedCalendar = calendarService.updateSyncStatus(
                calendarId, userId, updateDto.isSynced());
        return ResponseEntity.ok(updatedCalendar);
    }
}
