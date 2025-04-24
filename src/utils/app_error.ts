// Custom error class for handling app-specific errors
export default class AppError extends Error {
  public message: string; // Error message
  public statusCode: number; // HTTP status code
  public status: string; // Error status (FAIL or ERROR)
  public isOperational: boolean = true; // Operational flag for custom errors

  // Constructor for initializing error message and status code
  constructor(message: string, statusCode: number) {
    super(message); // Call parent constructor
    this.message = message; 
    this.statusCode = statusCode; 
    this.status = `${this.statusCode}`.startsWith("4") ? "FAIL" : "ERROR"; 
    Error.captureStackTrace(this, this.constructor); // Capture stack trace
  }
}
