package app.calendaranalytics.api.exception;

/**
 * A custom exception that is thrown to when a requested resource does not
 * exist.
 */
public class ResourceNotFoundException extends RuntimeException {

    /**
     * Constructs a ResourceNotFoundException.
     *
     * @param message The error message.
     */
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
