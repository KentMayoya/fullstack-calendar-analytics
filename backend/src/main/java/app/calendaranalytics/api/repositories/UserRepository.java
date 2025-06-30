package app.calendaranalytics.api.repositories;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import app.calendaranalytics.api.entities.User;

/**
 * An interface that provides data access methods for the User entity.
 *
 * By extending JpaRepository, Spring Data JPA implements CRUD methods used to
 * query the Supabase database. JpaRepository<User, UUID> tells Spring Boot that
 * User's Id (annotated using @Id) is a UUID, which is compatible with the User
 * object defined in the entities package.
 */
public interface UserRepository extends JpaRepository<User, UUID> {

}
