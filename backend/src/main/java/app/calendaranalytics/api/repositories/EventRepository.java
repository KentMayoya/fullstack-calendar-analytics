package app.calendaranalytics.api.repositories;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import app.calendaranalytics.api.entities.Calendar;
import app.calendaranalytics.api.entities.Event;

/**
 * An interface that provides data access methods for the Event entity.
 *
 * By extending JpaRepository, Spring Data JPA implements CRUD methods used to
 * query the Supabase database. JpaRepository&lt;Event, UUID&gt; tells Spring
 * Boot that Event's Id (annotated using @Id) is a UUID, which is compatible
 * with the Event object defined in the entities package.
 */
public interface EventRepository extends JpaRepository<Event, UUID> {

    /**
     * Queries for all events that to a user, whose calendar Id is included in
     * calendarIds, and whose events fall within the start and end range.
     *
     * @param userId The user the events belong to.
     * @param calendarIds The list of calendarIds the events belong to.
     * @param start The start date/time for the queried events.
     * @param end The end date/time for the queried events.
     * @return A list of Events that satisfy the user, calendar, and date range.
     */
    @Query("""
        SELECT e
        FROM Event e
        WHERE e.calendar.user.id = :userId
            AND e.calendar.id IN :calendarIds
            AND e.startTime < :end
            AND e.endTime > :start        
    """)
    public List<Event> findEventsForUserByCalendarIdsAndDateRange(
            @Param("userId") UUID userId,
            @Param("calendarIds") List<UUID> calendarIds,
            @Param("start") Instant start,
            @Param("end") Instant end);

    /**
     * Retrieves all Event entities that match the google event ids and
     * calendar.
     *
     * @param googleEventIds The google event ids to search for.
     * @param calendar The Calendar the events belongs to.
     * @return A list of Events related to the specified calendars.
     */
    public List<Event> findAllByGoogleEventIdInAndCalendar(List<String> googleEventIds,
            Calendar calendar);

    /**
     * Retrieves an Event that belongs to a specific user and matches a specific
     * event id.
     *
     * @param userId The user id related to the event.
     * @param eventId The event id to query for.
     * @return An Event, if it exists.
     */
    @Query("""
        SELECT e 
        FROM Event e 
        WHERE e.calendar.user.id = :userId
        AND e.id = :eventId 
    """)
    public Optional<Event> findByUserIdAndId(@Param("userId") UUID userId,
            @Param("eventId") UUID eventId);

    /**
     * Retrieves the total number of minutes for the events specified by the
     * passed filters.
     *
     * @param userId The related user id to retrieve event analytics for.
     * @param start Start date filter.
     * @param end End date filter.
     * @param calendarIds The calendar ids to search for events.
     * @param tagId The tag id used to search for events.
     * @return The sum of the found events' duration.
     */
    @Query("""
        SELECT SUM(e.durationInMinutes) 
        FROM Event e 
            JOIN e.eventTags et
        WHERE e.calendar.user.id = :userId
            AND e.startTime < :end
            AND e.endTime > :start
            AND e.calendar.id IN :calendarIds
            AND et.tag.id = :tagId
    """)
    public Long sumDurationForUserFilteredByTag(
            @Param("userId") UUID userId,
            @Param("start") Instant start,
            @Param("end") Instant end,
            @Param("calendarIds") List<UUID> calendarIds,
            @Param("tagId") UUID tagId
    );

    /**
     * Retrieves the total number of events by the passed filters.
     *
     * @param userId The related user id to retrieve event analytics for.
     * @param start Start date filter.
     * @param end End date filter.
     * @param calendarIds The calendar ids to search for events.
     * @param tagId The tag id used to search for events.
     * @return The number of found events.
     */
    @Query("""
        SELECT COUNT(e) 
        FROM Event e 
            JOIN e.eventTags et
        WHERE e.calendar.user.id = :userId
            AND e.startTime < :end
            AND e.endTime > :start
            AND e.calendar.id IN :calendarIds
            AND et.tag.id = :tagId
    """)
    public Long countEventsForUserFilteredByTag(
            @Param("userId") UUID userId,
            @Param("start") Instant start,
            @Param("end") Instant end,
            @Param("calendarIds") List<UUID> calendarIds,
            @Param("tagId") UUID tagId
    );

    /**
     * Queries for a list of events that belong to the specified user, within
     * the date range start and end, are related to the specified calendarIds
     * and tagId.
     *
     * @param userId The related user id to retrieve event analytics for.
     * @param start Start date filter.
     * @param end End date filter.
     * @param calendarIds The calendar ids to search for events.
     * @param tagId The tag id used to search for events.
     * @return A list of events found based on the passed filters.
     */
    @Query("""
        SELECT e
        FROM Event e
            JOIN e.eventTags et
        WHERE e.calendar.user.id = :userId
            AND e.startTime < :end
            AND e.endTime > :start 
            AND e.calendar.id IN :calendarIds
            AND et.tag.id = :tagId
    """)
    public List<Event> findEventsForUserByCalendarIdsAndTagAndDateRange(
            @Param("userId") UUID userId,
            @Param("start") Instant start,
            @Param("end") Instant end,
            @Param("calendarIds") List<UUID> calendarIds,
            @Param("tagId") UUID tagId);

    /**
     * Deletes all Events related to the specified calendarId.
     *
     * @param calendarId The calendarId used to search for the Events to delete.
     */
    public void deleteByCalendarId(UUID calendarId);
}
