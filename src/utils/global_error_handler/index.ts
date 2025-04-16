// Global error handling middleware for Express applications
// This middleware handles all errors that occur in the application
import { NextFunction, Request, Response } from "express";
import AppError from "../app_error";
import config from "../../config";

export default (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Set default status code and status if not provided
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "ERROR";

  // Development environment: Send detailed error information
  if (config.env === "development") {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,        // Full error object
      stack: err.stack   // Error stack trace
    });
  } 
  // Production environment: Send sanitized error information
  else {
    // For operational errors (expected errors), send the error message
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    } 
    // For programming errors (unexpected errors), send generic message
    else {
      res.status(500).json({
        status: "ERROR",
        message: "Something went wrong!"
      });
    }
  }
};