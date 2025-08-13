package app.calendaranalytics.api.dtos;

import java.util.List;
import java.util.UUID;

import lombok.Data;

/**
 * A Dto object to define the format for updating event tags endpoints.
 */
@Data
public class UpdateEventTagsRequestDto {

    private List<UUID> tagIds;
}
