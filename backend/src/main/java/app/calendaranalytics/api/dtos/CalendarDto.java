package app.calendaranalytics.api.dtos;

import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * A Calendar DTO that decouples the public API from the internal database
 * structure.
 */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CalendarDto {

    private UUID id;
    private String name;
    private String description;
    private String color;
    @JsonProperty("isSynced")
    private boolean isSynced;
}
