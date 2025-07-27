package app.calendaranalytics.api.dtos;

import java.util.List;
import java.util.UUID;

import lombok.Data;

@Data
public class UpdateEventTagsRequestDto {

    private List<UUID> tagIds;
}
