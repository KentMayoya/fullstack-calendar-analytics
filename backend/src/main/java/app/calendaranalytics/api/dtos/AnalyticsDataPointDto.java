package app.calendaranalytics.api.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * Defines the response for the /analytics/breakdown endpoint.
 */
@Data
@AllArgsConstructor
public class AnalyticsDataPointDto {

    private String name;
    private long minutes;
}
