package app.calendaranalytics.api.dtos;

import lombok.Getter;
import lombok.Setter;

/**
 * A Dto object to define the format for /me/token endpoint.
 */
@Getter
@Setter
public class SaveTokenRequestDto {

    private String refreshToken;
}
