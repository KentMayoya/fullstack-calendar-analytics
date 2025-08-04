package app.calendaranalytics.api.services;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

/**
 * A Service class to access the Supabase API with admin privileges.
 */
@Service
public class SupabaseAdminService {

    private final WebClient webClient;
    private final String serviceRoleKey;

    /**
     * Constructs a SupabaseAdminService and builds the web client with admin
     * permissions.
     *
     * @param supabaseUrl The supabase URL used to build the request.
     * @param serviceRoleKey Secret key used to access the API.
     */
    public SupabaseAdminService(
            @Value("${supabase.url}") String supabaseUrl,
            @Value("${supabase.service.role.key}") String serviceRoleKey
    ) {
        this.serviceRoleKey = serviceRoleKey;
        this.webClient = WebClient.builder()
                .baseUrl(supabaseUrl + "/auth/v1/admin")
                .build();
    }

    /**
     * Deletes the user from the auth.users table in the database.
     *
     * @param userId The user id to delete.
     */
    public void deleteUser(UUID userId) {
        webClient.delete()
                .uri("/users/" + userId)
                .header("apikey", this.serviceRoleKey)
                .header("Authorization", "Bearer " + this.serviceRoleKey)
                .retrieve()
                .bodyToMono(Void.class)
                .block();
    }
}
