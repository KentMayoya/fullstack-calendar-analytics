package app.calendaranalytics.api.dtos;

import lombok.Getter;
import lombok.Setter;

/**
 * RequestDto for the /api/v1/calendars/sync-all API endpoint.
 */
@Getter
@Setter
public class SyncAllCalendarsRequestDto {

    private String key;
}
