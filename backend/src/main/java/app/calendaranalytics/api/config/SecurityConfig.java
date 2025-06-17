/**
 * This class configures the Spring Security dependency, which protects the application's
 * endpoints. Without this class, the user will be met with a login page for every
 * endpoint.
 *
 * Cross-Site Request Forgery (CSRF) is a security vulnerability that tricks users into
 * executing potentially malicious actions. However, as this application is a stateless
 * RESTful web-application, CSRF can safely be disabled. This may lead to an increase in
 * performance.
 */
package app.calendaranalytics.api.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(authorize -> authorize
                // Exposes "/api/test" as a public endpoint.
                .requestMatchers("/api/test").permitAll()
                // All other requests will require authentication.
                .anyRequest().authenticated()
                );
        return http.build();
    }
}
