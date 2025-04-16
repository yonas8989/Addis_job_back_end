/**
 * Custom error class for handling application-specific errors
 * Extends the built-in Error class to add HTTP status code and operational error handling
 */
class AppError extends Error {
    /** HTTP status code for the error response */
    statusCode: number;
    
    /** Status string indicating if it's a client error ('fail') or server error ('error') */
    status: string;
    
    /** 
     * Indicates if this is an operational error (true) that we can predict and handle
     * As opposed to programming errors that might crash the application
     */
    isOperational: boolean;

    /**
     * Creates a new AppError instance
     * @param message - The error message to display
     * @param statusCode - HTTP status code (4xx for client errors, 5xx for server errors)
     */
    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        // Automatically set status based on status code (4xx = client error, 5xx = server error)
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        // Captures the stack trace, excluding the constructor call from it
        Error.captureStackTrace(this, this.constructor);
    }
}

export default AppError;