package app.calendaranalytics.api.services;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import app.calendaranalytics.api.dtos.CalendarDto;
import app.calendaranalytics.api.entities.Calendar;
import app.calendaranalytics.api.repositories.CalendarRepository;

/**
 * A Service class that handles business logic for the Calendar entity.
 */
@Service
public class CalendarService {

    // A Spring-managed Bean that provides data access methods for the Calendar
    // entity.
    private final CalendarRepository calendarRepository;

    /**
     * Constructs the CalendarService with a dependency on the
     * CalendarRepository.
     *
     * @param calendarRepository The repository responsible for Calendar data
     * access.
     */
    public CalendarService(CalendarRepository calendarRepository) {
        this.calendarRepository = calendarRepository;
    }

    /**
     * Queries for all calendars related to a specific User.
     *
     * @param userId The user id to query for in Supabase.
     * @return A list of CalendarDtos.
     */
    public List<CalendarDto> findCalendarsByUserId(UUID userId) {
        List<Calendar> calendars = calendarRepository.findAllByUserId(userId);
        return calendars.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    /**
     * Helper method that maps the private Calendar Entity to the public
     * CalendarDto.
     */
    private CalendarDto mapToDto(Calendar calendar) {
        CalendarDto dto = new CalendarDto();
        dto.setId(calendar.getId());
        dto.setName(calendar.getName());
        dto.setDescription(calendar.getDescription());
        dto.setColor(calendar.getColor());
        dto.setSynced(calendar.isSynced());
        return dto;
    }
}
