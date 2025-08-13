package app.calendaranalytics.api.services;

import java.io.IOException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.client.util.DateTime;
import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.model.CalendarListEntry;
import com.google.api.services.calendar.model.Event;
import com.google.api.services.calendar.model.Events;
import com.google.auth.http.HttpCredentialsAdapter;
import com.google.auth.oauth2.UserCredentials;

/**
 * A Service class that handles business logic that utilizes the Google Calendar
 * API.
 */
@Service
public class GoogleCalendarService {

    private final String clientId;
    private final String clientSecret;

    /**
     * Initializes Google Cloud's clientId and clientSecret constructs a
     * GoogleCalendarService with a dependency on EncryptionService.
     *
     * @param clientId Google Cloud's OAuth 2.0 Client Id
     * @param clientSecret Google Cloud's OAuth 2.0 Client Secret
     * @param encryptionService Encrypts and decrypts keys.
     */
    public GoogleCalendarService(
            @Value("${google.client.id}") String clientId,
            @Value("${google.client.secret}") String clientSecret,
            EncryptionService encryptionService
    ) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
    }

    /**
     * Retrieves the list of calendars for a user.
     *
     * @param refreshToken The decrypted Google refresh token used to generate
     * an access token.
     * @return A list of CalendarListEntry, which contains the Google Calendar's
     * metadata.
     * @throws IOException If Google Auth library fails to refresh token.
     */
    public List<CalendarListEntry> getUserCalendars(String refreshToken)
            throws IOException {
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
     * Returns a list of Events that have been modified since the last sync. If
     * this is the first time the calendar is being synced, only the events
     * modified in the last month (30 days) will be retrieved.
     *
     * @param refreshToken The Google refresh token used to generate an access
     * token.
     * @param googleCalendarId The Google Calendar id the events are related to.
     * @param lastSyncedAt The last time the calendar was synced. May be null if
     * the calendar has never been synced yet.
     * @return A list of Events related to the google calendar since the last
     * sync.
     * @throws IOException If Google Auth library fails to refresh token.
     */
    public List<Event> getCalendarEventsSinceLastSync(String refreshToken,
            String googleCalendarId, Instant lastSyncedAt) throws IOException {
        Calendar client = buildCalendarClient(refreshToken);
        List<Event> allEvents = new ArrayList<>();
        String pageToken = null;
        do {
            Calendar.Events.List request = client.events().list(googleCalendarId)
                    .setShowDeleted(true)
                    .setMaxResults(2500)
                    .setPageToken(pageToken);
            if (lastSyncedAt != null) {
                request.setUpdatedMin(new DateTime(lastSyncedAt.toEpochMilli()));
            } else {
                Instant oneMonthAgo = Instant.now().minus(30, ChronoUnit.DAYS);
                request.setTimeMin(new DateTime(oneMonthAgo.toEpochMilli()));
            }
            Events eventsPage = request.execute();
            List<Event> eventItems = eventsPage.getItems();
            if (eventItems != null) {
                allEvents.addAll(eventItems);
            }
            pageToken = eventsPage.getNextPageToken();
        } while (pageToken != null);
        return allEvents;
    }
}
