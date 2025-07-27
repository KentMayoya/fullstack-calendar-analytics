package app.calendaranalytics.api.repositories;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import app.calendaranalytics.api.entities.Tag;
import app.calendaranalytics.api.entities.User;

/**
 * An interface that provides data access methods for the Tag entity.
 *
 * By extending JpaRepository, Spring Data JPA implements CRUD methods used to
 * query the Supabase database. JpaRepository<Tag, UUID> tells Spring Boot that
 * Tag's Id (annotated using @Id) is a UUID, which is compatible with the Tag
 * object defined in the entities package.
 */
public interface TagRepository extends JpaRepository<Tag, UUID> {

    /**
     * Used to find potential duplicate tags belonging to this user.
     *
     * @param user The user to search for.
     * @param name The name of the tag.
     * @return An Optional Tag Entity.
     */
    public Optional<Tag> findByUserAndName(User user, String name);

    /**
     * Retrieves a list of tags belonging to a specific user.
     *
     * @param user The user to search for related tags.
     * @return A list of tags that belong to the user.
     */
    public List<Tag> findAllByUser(User user);

    /**
     * Returns a Tag that matches the specified user and id, if one exists.
     *
     * @param user The user to search for related tags.
     * @param id The tag id to search for.
     * @return An Optional Tag Entity.
     */
    public Optional<Tag> findByUserAndId(User user, UUID id);

    /**
     * Retrieves a list of tags that are related to the specified user and match
     * the id in ids.
     *
     * @param user The user to search for related tags.
     * @param ids A list of Tag ids.
     * @return A list of tags that exist in the database.
     */
    public List<Tag> findAllByUserAndIdIn(User user, List<UUID> ids);

    /**
     * Retrieves a list of Tags that are related to the specific event. This
     * method does not filter out tags for a specific user. Exposed APIs that
     * use this method should check if the event belongs to a user before using.
     *
     * @param eventId The eventId to search for related tags.
     * @return A list of Tags that are related to an event through the EventTag
     * join table.
     */
    @Query("""
        SELECT et.tag
        FROM EventTag et
        WHERE et.event.id = :eventId
            """)
    public List<Tag> findAllByEventId(@Param("eventId") UUID eventId);
}
