package app.calendaranalytics.api.services;

import java.io.IOException;
import java.time.Instant;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.client.util.DateTime;
import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.model.CalendarListEntry;
import com.google.api.services.calendar.model.Event;
import com.google.auth.http.HttpCredentialsAdapter;
import com.google.auth.oauth2.UserCredentials;

@Service
public class GoogleCalendarService {

    private final String clientId;
    private final String clientSecret;

    /**
     * Initializes Google Cloud's clientId and clientSecret.
     *
     * @param clientId Google Cloud's OAuth 2.0 Client Id
     * @param clientSecret Google Cloud's OAuth 2.0 Client Secret
     */
    public GoogleCalendarService(
            @Value("${google.client.id}") String clientId,
            @Value("${google.client.secret}") String clientSecret
    ) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
    }

    /**
     * Retrieves the list of calendars for a user.
     *
     * @param refreshToken The Google refresh token used to generate an access
     * token.
     * @return A list of CalendarListEntry, which contains the Google Calendar's
     * metadata.
     * @throws IOException If Google Auth library fails to refresh token.
     */
    public List<CalendarListEntry> getUserCalendars(String refreshToken) throws IOException {
        Calendar client = buildCalendarClient(refreshToken);
        return client.calendarList().list().execute().getItems();
    }

    /**
     * Builds the Calendar Client used to interact with Google Calendar's API.
     *
     * @param refreshToken The Google refresh token used to generate an access
     * token.
     * @return Calendar client.
     * @throws IOException If Google Auth library fails to refresh token.
     */
    private Calendar buildCalendarClient(String refreshToken) throws IOException {
        // Stores authentication information
        UserCredentials credentials = UserCredentials.newBuilder()
                .setClientId(this.clientId)
                .setClientSecret(this.clientSecret)
                .setRefreshToken(refreshToken)
                .build();
        credentials.refreshIfExpired();
        // A wrapper that enables UserCredentials to be compatible with modern Google Calendar
        // client library builder 
        HttpCredentialsAdapter adaptedCredentials = new HttpCredentialsAdapter(credentials);
        // Builds the service client that interacts with the Google Calendar API
        return new Calendar.Builder(
                new NetHttpTransport(),
                GsonFactory.getDefaultInstance(),
                adaptedCredentials
        ).setApplicationName("Calendar Analytics").build();
    }

    /**
     * Returns a list of Events that have been modified since the last sync.
     *
     * @param refreshToken The Google refresh token used to generate an access
     * token.
     * @param googleCalendarId
     * @param lastSyncedAt The last time the calendar was synced. May be null if
     * the calendar has never been synced yet.
     * @return
     * @throws IOException If Google Auth library fails to refresh token.
     */
    public List<Event> getCalendarEventsSinceLastSync(String refreshToken,
            String googleCalendarId, Instant lastSyncedAt) throws IOException {
        Calendar client = buildCalendarClient(refreshToken);
        Calendar.Events.List request = client.events().list(googleCalendarId)
                .setShowDeleted(true);
        if (lastSyncedAt != null) {
            request.setUpdatedMin(new DateTime(lastSyncedAt.toEpochMilli()));
        }
        return request.execute().getItems();
    }
}
