/**
 * This class configures the Spring Security dependency, which protects the application's
 * endpoints. Without this class, the user will be met with a login page for every
 * endpoint.
 *
 * The @Configuration annotation tells Spring Boot that this class will contain at least
 * one Bean definition.
 *
 * The @EnableWebSecurity imports Spring Boot's web security configuration, which enables
 * the enforcement of authentication and authorization.
 */
package app.calendaranalytics.api.config;

import java.util.Arrays;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    /**
     * Configures the security of the application's endpoints.
     *
     * Cross-Site Request Forgery (CSRF) is a security vulnerability that tricks
     * users into executing potentially malicious actions. However, as this
     * application is a stateless RESTful web-application, CSRF can safely be
     * disabled. This may lead to an increase in performance.
     *
     * @param http Used to assemble the web-security chain. Contains methods to
     * register security settings.
     * @return A list of security filters. Each request will pass through this
     * filter.
     * @throws Exception If a misconfiguration occurs during startup.
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(authorize -> authorize
                // Exposes "/api/test" as a public endpoint.
                .requestMatchers("/api/test").permitAll()
                // All other requests will require authentication.
                .anyRequest().authenticated()
                );
        return http.build();
    }

    /**
     * Configures the CORS filter. It is currently configured for local
     * development only. Once the backend and frontend are both deployed, the
     * CORS policy must be adjusted to allow requests.
     *
     * @return The configured CorsConfigurationSource object.
     */
    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // We apply this CORS configuration to all paths in this application.
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
