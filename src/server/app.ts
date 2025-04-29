import AppError from "../utils/app_error";
import geh from "../utils/global_error_handler";
import config from "../config";
import express, { Application, NextFunction, Request, Response } from "express";
import { v1 } from "./routes";
import cors from "cors"; // Now properly typed after installing @types/cors

const app: Application = express();

// CORS Middleware
app.use(cors({
  origin: config.cors.allowedOrigins,
  methods: config.cors.methods,
  allowedHeaders: config.cors.allowedHeaders,
  credentials: true
}));

// Built-in middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// API Key middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers["x-api-key"];
  if (!apiKey) return next(new AppError("Please provide the API Key", 400));
  if (config.api_key !== apiKey) return next(new AppError("Invalid API Key", 400));
  next();
});

// Routes
v1(app);

// 404 Handler
app.use("*", (req: Request, res: Response, next: NextFunction) => {
  return next(new AppError(`Unknown URL`, 404));
});

// Global error handler
app.use(geh);

export default app;