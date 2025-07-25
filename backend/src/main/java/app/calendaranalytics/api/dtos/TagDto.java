package app.calendaranalytics.api.dtos;

import java.util.UUID;

import lombok.Data;

/**
 * A Tag DTO that decouples the public API from the internal database structure.
 */
@Data
public class TagDto {

    private UUID id;
    private String name;
}
