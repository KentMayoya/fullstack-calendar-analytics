package app.calendaranalytics.api.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateCalendarDto {

    @JsonProperty("isSynced")
    private boolean isSynced;
}
