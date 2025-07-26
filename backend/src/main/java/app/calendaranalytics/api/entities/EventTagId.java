package app.calendaranalytics.api.entities;

import java.io.Serializable;
import java.util.UUID;

import lombok.Data;

/**
 * Represents the composite key for EventTag in the database.
 */
@Data
public class EventTagId implements Serializable {

    private UUID event;
    private UUID tag;
}
