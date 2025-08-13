package app.calendaranalytics.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * The main entry point for the Calendar Analytics API application.
 */
@SpringBootApplication
public class ApiApplication {

    /**
     * The main method that serves as the entry point for the Spring Boot
     * application.
     *
     * @param args Command-line arguments passed to the application.
     */
    public static void main(String[] args) {
        SpringApplication.run(ApiApplication.class, args);
    }

}
