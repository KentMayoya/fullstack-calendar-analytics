package app.calendaranalytics.api.exception;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

/**
 * Global exception handler that intercepts all thrown exceptions and formats
 * them into a standardized response before sending them to the frontend.
 */
@ControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Handler for ResourceNotFoundException. The response is a JSON object
     * containing a timestamp and error message.
     *
     * @param ex The exception that was thrown.
     * @return ResponseEntity containing a JSON error body and 404 status.
     */
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Object> handleResourceNotFound(ResourceNotFoundException ex) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", Instant.now());
        body.put("error", ex.getMessage());
        return new ResponseEntity<>(body, HttpStatus.NOT_FOUND);
    }

    /**
     * Handler for ResourceNotFoundException. The response is a JSON object
     * containing a timestamp and error message.
     *
     * @param ex The exception that was thrown.
     * @return ResponseEntity containing a JSON error body and 400 status.
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Object> handleIllegalArgument(IllegalArgumentException ex) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", Instant.now());
        body.put("error", ex.getMessage());
        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

    /**
     * Handler for DuplicateResourceException. The response is a JSON object
     * containing a timestamp and error message.
     *
     * @param ex The exception that was thrown.
     * @return ResponseEntity containing a JSON error body and 409 status.
     */
    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<Object> handleDuplicateResource(DuplicateResourceException ex) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", Instant.now());
        body.put("error", ex.getMessage());
        return new ResponseEntity<>(body, HttpStatus.CONFLICT);
    }
}
