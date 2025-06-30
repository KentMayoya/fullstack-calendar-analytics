package app.calendaranalytics.api.services;

import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;

import app.calendaranalytics.api.entities.User;
import app.calendaranalytics.api.repositories.UserRepository;

/**
 * A Service class that handles business logic for the User entity.
 */
@Service
public class UserService {

    // A Spring-managed Bean that provides data access methods for the User entity.
    private final UserRepository userRepository;

    /**
     * Constructs the UserService with a dependency on the UserRepository.
     *
     * @param userRepository The repository responsible for user data access.
     */
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Queries for a User by its Id.
     *
     * @param userId The user id to query for in Supabase.
     * @return Contains a User if a matching userId is found. Otherwise returns
     * an empty Optional object.
     */
    public Optional<User> findUserById(UUID userId) {
        return userRepository.findById(userId);
    }
}
