package app.calendaranalytics.api.repositories;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

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

}
