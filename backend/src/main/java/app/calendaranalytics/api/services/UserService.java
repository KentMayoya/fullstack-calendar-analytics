package app.calendaranalytics.api.services;

import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;

import app.calendaranalytics.api.dtos.UserDto;
import app.calendaranalytics.api.entities.User;
import app.calendaranalytics.api.exception.ResourceNotFoundException;
import app.calendaranalytics.api.repositories.UserRepository;
import jakarta.transaction.Transactional;

/**
 * A Service class that handles business logic for the User entity.
 */
@Service
public class UserService {

    private final UserRepository userRepository;
    private final EncryptionService encryptionService;
    private final SupabaseAdminService supabaseAdminService;

    /**
     * Constructs the UserService with a dependency on the UserRepository and
     * EncryptionService.
     *
     * @param userRepository The repository responsible for user data access.
     * @param encryptionService Encrypts and decrypts keys.
     */
    public UserService(UserRepository userRepository,
            EncryptionService encryptionService,
            SupabaseAdminService supabaseAdminService) {
        this.userRepository = userRepository;
        this.encryptionService = encryptionService;
        this.supabaseAdminService = supabaseAdminService;
    }

    /**
     * Queries for a User by its Id.
     *
     * @param userId The user id to query for.
     * @return Contains a User if a matching userId is found. Otherwise returns
     * an empty Optional object.
     */
    public Optional<UserDto> findUserById(UUID userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        return userOptional.map(this::mapToDto);
    }

    /**
     * Helper method that maps the private User Entity to the public UserDto.
     *
     * @param userEntity The User entity to convert.
     */
    private UserDto mapToDto(User userEntity) {
        UserDto dto = new UserDto();
        dto.setFullName(userEntity.getFullName());
        dto.setEmail(userEntity.getEmail());
        dto.setGoogleTokenSaved(userEntity.isGoogleTokenSaved());
        return dto;
    }

    /**
     * Encrypts the refresh token and stores it in the database for the
     * specified user.
     *
     * @param userId The user id to query for.
     * @param refreshToken The refresh token to encrypt before storing.
     */
    @Transactional
    public void saveRefreshToken(UUID userId, String refreshToken) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                "User not found with id: " + userId));
        String encryptedToken = encryptionService.encrypt(refreshToken);
        user.setGoogleRefreshToken(encryptedToken);
        user.setGoogleTokenSaved(true);
        userRepository.save(user);
    }

    /**
     * Deletes a user's account, including all calendars, events, and tags.
     *
     * @param userId The user to delete.
     * @throws ResourceNotFoundException If the specified userId does not exist.
     */
    @Transactional
    public void deleteUser(UUID userId) {
        userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                "User not found with id: " + userId));
        supabaseAdminService.deleteUser(userId);
    }
}
