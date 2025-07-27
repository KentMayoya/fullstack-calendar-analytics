package app.calendaranalytics.api.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import app.calendaranalytics.api.entities.Event;
import app.calendaranalytics.api.entities.EventTag;
import app.calendaranalytics.api.entities.EventTagId;

/**
 * An interface that provides data access methods for the EventTag entity.
 *
 * By extending JpaRepository, Spring Data JPA implements CRUD methods used to
 * query the Supabase database.
 */
public interface EventTagRepository extends JpaRepository<EventTag, EventTagId> {

    /**
     * Deletes all EventTags related to the specified event. This method does
     * not filter out events for a specific user. Exposed APIs that use this
     * method should check if the event belongs to a user before using.
     *
     * @param event The event to delete related EventTags.
     */
    void deleteByEvent(Event event);
}
