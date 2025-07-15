package app.calendaranalytics.api.services;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.model.CalendarListEntry;
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
        Calendar client = new Calendar.Builder(
                new NetHttpTransport(),
                GsonFactory.getDefaultInstance(),
                adaptedCredentials
        ).setApplicationName("Calendar Analytics").build();
        return client.calendarList().list().execute().getItems();
    }
}
