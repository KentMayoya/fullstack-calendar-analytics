package app.calendaranalytics.api.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * A User DTO that decouples the public API from the internal database
 * structure. For this project, the DTO may be identical to the corresponding
 * entity, however, creating a DTO is a best practice for future features.
 */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserDto {

    private String fullName;
    private String email;
}
