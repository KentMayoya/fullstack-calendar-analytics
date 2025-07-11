package app.calendaranalytics.api.repositories;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

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

    // Spring Data JPA will automatically generate a query that finds all 
    // Calendars related to the userId
    List<Calendar> findAllByUserId(UUID userId);
}
