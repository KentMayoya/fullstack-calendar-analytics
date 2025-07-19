package app.calendaranalytics.api.dtos;

import java.time.Instant;
import java.util.UUID;

import lombok.Data;

/**
 * An Event DTO that decouples the public API from the internal database
 * structure. For this project, the DTO may be identical to the corresponding
 * entity, however, creating a DTO is a best practice for future features.
 */
@Data
public class EventDto {

    private UUID id;
    private UUID calendarId;
    private String title;
    private String description;
    private Instant startTime;
    private Instant endTime;
    private boolean allDay;
    private String color;
    private Integer durationInMinutes;
}
