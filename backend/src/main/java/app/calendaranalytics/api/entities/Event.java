package app.calendaranalytics.api.entities;

import java.time.Instant;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * This class represents the public.events class defined in Supabase.
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "events", schema = "public")
public class Event {

    @Id
    private UUID id;

    // Many events can belong to one calendar
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "calendar_id", nullable = false)
    private Calendar calendar;

    @Column(name = "google_event_id", nullable = false)
    private String googleEventId;

    @Column
    private String title;

    @Column
    private String description;

    @Column(name = "start_time", nullable = false)
    private Instant startTime;

    @Column(name = "end_time", nullable = false)
    private Instant endTime;

    @Column(name = "is_all_day")
    private boolean isAllDay;

    @Column(name = "duration_in_minutes", nullable = false)
    private int durationInMinutes;

    @Column(name = "created_at")
    private Instant createdAt;
}
