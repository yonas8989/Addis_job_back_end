"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Custom error class for handling application-specific errors
 * Extends the built-in Error class to add HTTP status code and operational error handling
 */
class AppError extends Error {
    /**
     * Creates a new AppError instance
     * @param message - The error message to display
     * @param statusCode - HTTP status code (4xx for client errors, 5xx for server errors)
     */
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        // Automatically set status based on status code (4xx = client error, 5xx = server error)
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;
        // Captures the stack trace, excluding the constructor call from it
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.default = AppError;
