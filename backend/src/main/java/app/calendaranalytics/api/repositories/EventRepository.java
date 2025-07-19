package app.calendaranalytics.api.repositories;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import app.calendaranalytics.api.entities.Event;

/**
 * An interface that provides data access methods for the Event entity.
 *
 * By extending JpaRepository, Spring Data JPA implements CRUD methods used to
 * query the Supabase database. JpaRepository<Event, UUID> tells Spring Boot
 * that Event's Id (annotated using @Id) is a UUID, which is compatible with the
 * Event object defined in the entities package.
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
}
