package app.calendaranalytics.api.entities;

import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * This class represents the public.users class defined in Supabase.
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "users", schema = "public")
public class User {

    @Id
    private UUID id;

    @Column(name = "full_name")
    private String fullName;

    @Column(name = "email")
    private String email;

    @Column(name = "is_google_token_saved")
    private boolean isGoogleTokenSaved;

    @Column(name = "google_refresh_token")
    private String googleRefreshToken;

}
