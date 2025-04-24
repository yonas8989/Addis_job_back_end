import AppError from "../utils/app_error"; // Import custom error handler
import geh from "../utils/global_error_handler"; // Import global error handler
import config from "../config"; // Import app configuration
import express, { Application, NextFunction, Request, Response } from "express"; // Import express and types
import { v1 } from "./routes"; // Import version 1 routes

// Initialize express application
const app: Application = express();

// Built-in middlewares for JSON and URL encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// API Key validation middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers["x-api-key"]; // Get API key from headers

  // If API Key is missing or invalid
  if (!apiKey) {
    return next(new AppError("Please provide the API Key", 400));
  }
  if (config.api_key !== apiKey)
    return next(new AppError("Invalid API Key", 400));

  next(); // Proceed to the next middleware or route
});

// Use v1 routes
v1(app);

// Handle unknown URLs
app.use("*", (req: Request, res: Response, next: NextFunction) => {
  return next(new AppError(`Unknown URL`, 404)); // Handle 404 errors for unknown routes
});

// Global error handler middleware
app.use(geh);

export default app; // Export app for use in other files
