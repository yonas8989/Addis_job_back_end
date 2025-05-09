"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Custom error class for handling app-specific errors
class AppError extends Error {
    // Constructor for initializing error message and status code
    constructor(message, statusCode) {
        super(message); // Call parent constructor
        this.isOperational = true; // Operational flag for custom errors
        this.message = message;
        this.statusCode = statusCode;
        this.status = `${this.statusCode}`.startsWith("4") ? "FAIL" : "ERROR";
        Error.captureStackTrace(this, this.constructor); // Capture stack trace
    }
}
exports.default = AppError;
