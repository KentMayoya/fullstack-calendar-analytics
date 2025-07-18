package app.calendaranalytics.api.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SaveTokenRequestDto {

    private String refreshToken;
}
