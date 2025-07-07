package app.calendaranalytics.api.controllers;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import app.calendaranalytics.api.dtos.UserDto;
import app.calendaranalytics.api.services.UserService;

/**
 * Defines the API endpoint for retrieving the user's details from Supabase.
 */
@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    // A Spring-managed Bean that provides data access methods for the User entity.
    private final UserService userService;

    /**
     * Constructs the UserService with a dependency on the UserRepository.
     *
     * @param userRepository The repository responsible for user data access.
     */
    public UserController(UserService userService) {
        this.userService = userService;
    }

    /**
     * Retrieves the user from Supabase using the current session.
     *
     * @param authentication An object provided by the Spring Security
     * framework. Contains all the information regarding the currently logged-in
     * user.
     * @return A UserDto and 200 OK response if the User is found. Otherwise
     * returns a 404 Not Found response.
     */
    @GetMapping("/me")
    public ResponseEntity<UserDto> getMyUser(Authentication authentication) {
        UUID userId = UUID.fromString(authentication.getName());
        return userService.findUserById(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
