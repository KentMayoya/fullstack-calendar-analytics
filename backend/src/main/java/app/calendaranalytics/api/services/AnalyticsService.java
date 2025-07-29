package app.calendaranalytics.api.services;

import java.time.DayOfWeek;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.Month;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.time.format.TextStyle;
import java.time.temporal.ChronoUnit;
import java.time.temporal.TemporalAdjusters;
import java.time.temporal.WeekFields;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import java.util.stream.Stream;

import org.springframework.stereotype.Service;

import app.calendaranalytics.api.dtos.AnalyticsDataPointDto;
import app.calendaranalytics.api.dtos.SummaryResponseDto;
import app.calendaranalytics.api.entities.Event;
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
    public SummaryResponseDto getSummary(UUID userId, LocalDate start,
            LocalDate end, List<UUID> calendarIds, UUID tagId) {
        // Validate userId
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

    /**
     * Retrieves all the events based on a userId, start and end date,
     * calendarIds, and tagIds and returns a breakdown of the events by period
     * and the number of minutes for that period. Each period is based on the
     * range (e.g. a week is broken down into each day).
     *
     * @param userId The related user id to retrieve event analytics for.
     * @param start Start date filter.
     * @param end End date filter.
     * @param calendarIds The calendar ids to search for events.
     * @param tagId The tag id used to search for events.
     * @return An AnalyticsDataPointDto with the total number of minutes for
     * each category depending on the range.
     */
    public List<AnalyticsDataPointDto> getBreakdown(UUID userId, String range,
            LocalDate date, List<UUID> calendarIds, UUID tagId) {
        // Validate userId
        userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                "User not found: " + userId));
        DateRange dateRange = calculateDateRange(date, range);
        List<Event> events = eventRepository
                .findEventsForUserByCalendarIdsAndTagAndDateRange(userId,
                        dateRange.start, dateRange.end, calendarIds, tagId);
        return convertToAnalyticsDataPointDto(events, range);
    }

    /**
     * Converts a list of events into a a list of AnalyticsDataPointDto.
     *
     * @param events A list of events within a range.
     * @param range The range for the breakdown.
     * @return An AnalyticsDataPointDto with the total number of minutes for
     * each category depending on the range.
     * @throws IllegalArgumentException If an invalid range is provided.
     */
    private List<AnalyticsDataPointDto> convertToAnalyticsDataPointDto(
            List<Event> events, String range) {
        return switch (range) {
            case "day" -> {
                long[] minutesInHour = collectMinutesToHourlyBuckets(events);
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("ha", Locale.US);
                List<AnalyticsDataPointDto> result
                        = IntStream.range(0, 24)
                                .mapToObj(hour -> new AnalyticsDataPointDto(
                                LocalTime.of(hour, 0).format(formatter).toLowerCase(),
                                minutesInHour[hour]
                        ))
                                .collect(Collectors.toList());
                yield result;
            }
            case "week" -> {
                Map<DayOfWeek, Long> minutesPerDay = events.stream()
                        .collect(Collectors.groupingBy(
                                // For each event, use the day of the week as
                                // the grouping key
                                event -> event.getStartTime().atZone(ZoneOffset.UTC)
                                        .getDayOfWeek(),
                                // For all events in the same day, sum their
                                // duration in minutes
                                Collectors.summingLong(event
                                        -> (long) event.getDurationInMinutes())
                        ));
                List<AnalyticsDataPointDto> result
                        = // Explicitly list each day of the week in case 
                        // the minutesPerDay Map is missing a few days as keys
                        Stream.of(DayOfWeek.SUNDAY,
                                DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY,
                                DayOfWeek.THURSDAY, DayOfWeek.FRIDAY, DayOfWeek.SATURDAY)
                                // For each day, create an AnalyticsDataPointDto
                                .map(day -> new AnalyticsDataPointDto(
                                day.getDisplayName(TextStyle.SHORT, Locale.US),
                                minutesPerDay.getOrDefault(day, 0L)
                        ))
                                .collect(Collectors.toList());
                yield result;
            }
            case "month" -> {
                Map<Integer, Long> minutesPerWeek = events.stream()
                        .collect(Collectors.groupingBy(
                                event -> event.getStartTime().atZone(ZoneOffset.UTC)
                                        .get(WeekFields.of(Locale.US).weekOfMonth()),
                                Collectors.summingLong(event
                                        -> (long) event.getDurationInMinutes())
                        ));
                List<AnalyticsDataPointDto> result
                        = IntStream.rangeClosed(1, 5).mapToObj(weekNum
                                -> new AnalyticsDataPointDto("Week " + weekNum, minutesPerWeek
                                .getOrDefault(weekNum, 0L)
                        ))
                                .collect(Collectors.toList());
                yield result;
            }
            case "year" -> {
                Map<Month, Long> minutesPerMonth = events.stream()
                        .collect(Collectors.groupingBy(
                                event -> event.getStartTime().atZone(ZoneOffset.UTC)
                                        .getMonth(), Collectors.summingLong(event
                                        -> (long) event.getDurationInMinutes())
                        ));
                List<AnalyticsDataPointDto> result
                        = Stream.of(Month.values())
                                .map(month -> new AnalyticsDataPointDto(
                                month.getDisplayName(TextStyle.SHORT, Locale.US),
                                minutesPerMonth.getOrDefault(month, 0L)
                        ))
                                .collect(Collectors.toList());
                yield result;
            }
            default ->
                throw new IllegalArgumentException(range + " is not a valid range.");
        };
    }

    /**
     * Collects the duration of events and places them in an array, where each
     * index represents an hour. Events that are longer than an hour should
     * spill into the next hour. That does not mean, however, that a bucket
     * cannot exceed 60 minutes. Multiple events that overlap may result in a
     * value larger than 60.
     *
     * @param events A list of events
     * @return An array containing the minutes for each hour.
     */
    private long[] collectMinutesToHourlyBuckets(List<Event> events) {
        // Should ideally come from the user's profile, but hardcoded
        // for now.
        ZoneId userTimeZone = ZoneId.of("America/Los_Angeles");
        final int hoursInDay = 24;
        long[] minutesInHour = new long[hoursInDay];
        for (Event event : events) {
            LocalDateTime start = event.getStartTime().atZone(userTimeZone)
                    .toLocalDateTime();
            LocalDateTime end = event.getEndTime().atZone(userTimeZone)
                    .toLocalDateTime();
            // Start at the beginning of the hour the event starts in
            // i.e. truncate the minutes. This is used as the index for the bucket
            LocalDateTime currentHourStart = start.truncatedTo(ChronoUnit.HOURS);
            while (currentHourStart.isBefore(end)) {
                LocalDateTime endOfCurrentHour = currentHourStart
                        .plusHours(1);
                // Determine the actual start and end time within this 1-hour slice
                LocalDateTime effectiveStart
                        = start.isAfter(currentHourStart) ? start : currentHourStart;
                LocalDateTime effectiveEnd
                        = end.isBefore(endOfCurrentHour) ? end : endOfCurrentHour;
                // Calculate the duration of the slice and add it to the bucket
                long minutesInThisHour = Duration.between(effectiveStart,
                        effectiveEnd).toMinutes();
                if (minutesInThisHour > 0) {
                    minutesInHour[currentHourStart.getHour()] += minutesInThisHour;
                }
                // Move to the next hour
                currentHourStart = currentHourStart.plusHours(1);
            }
        }
        return minutesInHour;
    }

    /**
     * Represents a range of time.
     *
     * @param start the start timestamp of the range
     * @param end the end timestamp of the range
     */
    private record DateRange(Instant start, Instant end) {

    }

    /**
     * Given a date and range, calculates the start and end date.
     *
     * @param date A date within a range.
     * @param range A time period e.g. week.
     * @return A DateRange which contains a start and end date.
     * @throws IllegalArgumentException If an invalid range is provided.
     */
    private DateRange calculateDateRange(LocalDate date, String range) {
        return switch (range) {
            case "day" -> {
                Instant startOfDay = date.atStartOfDay(ZoneOffset.UTC).toInstant();
                Instant endOfDay = date.plusDays(1)
                        .atStartOfDay(ZoneOffset.UTC).toInstant();
                yield new DateRange(startOfDay, endOfDay);
            }
            case "week" -> {
                LocalDate startOfWeek = date.with(TemporalAdjusters
                        .previousOrSame(DayOfWeek.SUNDAY));
                LocalDate endOfWeek = date.with(TemporalAdjusters
                        .nextOrSame(DayOfWeek.SATURDAY));
                Instant start = startOfWeek.atStartOfDay(ZoneOffset.UTC).toInstant();
                Instant end = endOfWeek.plusDays(1).atStartOfDay(ZoneOffset.UTC)
                        .toInstant();
                yield new DateRange(start, end);
            }
            case "month" -> {
                LocalDate startOfMonth = date.with(TemporalAdjusters
                        .firstDayOfMonth());
                LocalDate endOfMonth = date.with(TemporalAdjusters
                        .lastDayOfMonth());
                Instant start = startOfMonth.atStartOfDay(ZoneOffset.UTC).toInstant();
                Instant end = endOfMonth.plusDays(1).atStartOfDay(ZoneOffset.UTC)
                        .toInstant();
                yield new DateRange(start, end);
            }
            case "year" -> {
                LocalDate startOfYear = date.with(TemporalAdjusters
                        .firstDayOfYear());
                LocalDate endOfYear = date.with(TemporalAdjusters
                        .lastDayOfYear());
                Instant start = startOfYear.atStartOfDay(ZoneOffset.UTC).toInstant();
                Instant end = endOfYear.plusDays(1).atStartOfDay(ZoneOffset.UTC)
                        .toInstant();
                yield new DateRange(start, end);
            }
            default ->
                throw new IllegalArgumentException("Invalid range specified");
        };
    }
}
