package app.calendaranalytics.api.repositories;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import app.calendaranalytics.api.entities.Calendar;

/**
 * An interface that provides data access methods for the Calendar entity.
 *
 * By extending JpaRepository, Spring Data JPA implements CRUD methods used to
 * query the Supabase database. JpaRepository<Calendar, UUID> tells Spring Boot
 * that Calendar's Id (annotated using @Id) is a UUID, which is compatible with
 * the Calendar object defined in the entities package.
 */
public interface CalendarRepository extends JpaRepository<Calendar, UUID> {

    /**
     * Queries for a list of calendars that belong to the specified user.
     *
     * @param userId The user the calendars belong to.
     * @return A list of Calendars.
     */
    List<Calendar> findAllByUserId(UUID userId);

    /**
     * Queries the specified calendar belonging to the specified user.
     *
     * @param id The calendar id to search for.
     * @param userId The user the calendar belongs to.
     * @return A calendar that matches the id and userId if a match is found.
     */
    @Transactional
    Optional<Calendar> findByIdAndUserId(UUID id, UUID userId);

    /**
     * Queries the specified calendar by Google Calendar id and user id.
     *
     * @param googleCalendarId The google calendar Id to query.
     * @param userId The user the calendar belongs to.
     * @return A Calendar that matches the googleCalendarId and userId if a
     * match is found.
     */
    @Transactional
    Optional<Calendar> findByGoogleCalendarIdAndUserId(String googleCalendarId, UUID userId);
}
