package app.calendaranalytics.api.dtos;

import lombok.Getter;
import lombok.Setter;

/**
 * ResponseDto for the /api/v1/analytics/summary API endpoint.
 */
@Getter
@Setter
public class SummaryResponseDto {

    private long totalMinutes;
    private long totalEvents;
}
