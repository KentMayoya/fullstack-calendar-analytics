package app.calendaranalytics.api.controllers;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import app.calendaranalytics.api.dtos.SaveTokenRequestDto;
import app.calendaranalytics.api.dtos.UserDto;
import app.calendaranalytics.api.services.UserService;

/**
 * Defines the API endpoint for retrieving the user's details from Supabase.
 */
@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    // A Spring-managed Bean that provides business logic methods for the User
    // entity.
    private final UserService userService;

    /**
     * Constructs the UserController with a dependency on the UserService.
     *
     * @param userService The service managing user-related business logic.
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

    /**
     * Stores the user's refresh token in the database.
     *
     * @param requestDto A JSON containing a refresh token.
     * @param authentication An object provided by the Spring Security
     * framework. Contains all the information regarding the currently logged-in
     * user.
     */
    @PostMapping("/me/token")
    @ResponseStatus(HttpStatus.OK)
    public void saveRefreshToken(@RequestBody SaveTokenRequestDto requestDto,
            Authentication authentication) {
        UUID userId = UUID.fromString(authentication.getName());
        userService.saveRefreshToken(userId, requestDto.getRefreshToken());
    }

    /**
     * Deletes the current user's account, including all calendars, events, and
     * tags.
     *
     * @param authentication An object provided by the Spring Security
     * framework. Contains all the information regarding the currently logged-in
     * user.
     */
    @DeleteMapping("/me")
    @ResponseStatus(HttpStatus.OK)
    public void deleteUser(Authentication authentication) {
        UUID userId = UUID.fromString(authentication.getName());
        userService.deleteUser(userId);
    }
}
