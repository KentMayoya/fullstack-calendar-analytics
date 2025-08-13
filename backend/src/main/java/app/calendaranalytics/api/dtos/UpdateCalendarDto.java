package app.calendaranalytics.api.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;

/**
 * A Dto object to define the format for Calendar endpoints.
 */
@Getter
@Setter
public class UpdateCalendarDto {

    @JsonProperty("isSynced")
    private boolean isSynced;
}
