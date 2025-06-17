/**
 * This class handles requests to the "/api" endpoint. The purpose of this class is
 * to verify the backend application is running and is used for testing.
 *
 * Navigating to /api/test displays a simple confirmation message.
 */
package app.calendaranalytics.api.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class TestController {

    @GetMapping("/test")
    public String test() {
        return "Backend application is running!";
    }
}
