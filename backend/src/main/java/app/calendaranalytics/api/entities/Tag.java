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
 * This class represents the public.tags class defined in Supabase.
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "tags", schema = "public")
public class Tag {

    @Id
    private UUID id;

    // Many tags can belong to one user
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column
    private String name;

    @Column(name = "created_at")
    private Instant createdAt;
}
