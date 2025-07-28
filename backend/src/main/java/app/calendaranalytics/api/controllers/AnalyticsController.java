package app.calendaranalytics.api.controllers;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import app.calendaranalytics.api.dtos.SummaryResponseDto;
import app.calendaranalytics.api.services.AnalyticsService;

@RestController
@RequestMapping("/api/v1/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    /**
     * Constructs the AnalyticsController with a dependency on the
     * AnalyticsService.
     *
     * @param analyticsService The service managing analytics-related business
     * logic.
     */
    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    /**
     * Retrieves a summary of the events based on the userId, start, end,
     * calendarIds, and tagId parameters. The summary includes the total number
     * of minutes and the total number of events.
     *
     * @param start Start date filter.
     * @param end End date filter.
     * @param calendarIds The calendar ids to search for events.
     * @param tagId The tag id used to search for events.
     * @param authentication An object provided by the Spring Security
     * framework. Contains all the information regarding the currently logged-in
     * user.
     * @return A SummaryResponseDto with the total number of minutes and events.
     */
    @GetMapping("/summary")
    public ResponseEntity<SummaryResponseDto> getSummary(
            @RequestParam("start") LocalDate start,
            @RequestParam("end") LocalDate end,
            @RequestParam("calendarIds") List<UUID> calendarIds,
            @RequestParam("tagId") UUID tagId,
            Authentication authentication
    ) {
        UUID userId = UUID.fromString(authentication.getName());
        SummaryResponseDto responseDto = analyticsService
                .getSummary(userId, start, end, calendarIds, tagId);
        return ResponseEntity.ok(responseDto);
    }
}
