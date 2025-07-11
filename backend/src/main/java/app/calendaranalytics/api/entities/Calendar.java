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
 * This class represents the public.calendars class defined in Supabase.
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "calendars", schema = "public")
public class Calendar {

    @Id
    private UUID id;

    // Many calendars can belong to one user
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "google_calendar_id", nullable = false)
    private String googleCalendarId;

    @Column(nullable = false)
    private String name;

    @Column
    private String description;

    @Column
    private String color;

    @Column(name = "is_synced", nullable = false)
    private boolean isSynced;

    @Column(name = "last_synced_at")
    private Instant lastSyncedAt;

    @Column(name = "created_at")
    private Instant createdAt;
}
