package app.calendaranalytics.api.exception;

/**
 * A custom exception that is thrown to prevent duplicate resources from
 * existing in the database.
 */
public class DuplicateResourceException extends RuntimeException {

    /**
     * Constructs a DuplicateResourceException.
     *
     * @param message The error message.
     */
    public DuplicateResourceException(String message) {
        super(message);
    }
}
