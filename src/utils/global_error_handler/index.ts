import { NextFunction, Request, Response } from "express";
import AppError from "../app_error";
import sendDevError from "./send_dev_error";
import sendProdError from "./send_prod_error";
import configs from "../../config";
import errors from "./errors";

// Global error handler
export default (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Set default status code and status if not already provided
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "ERROR";

  // Handle specific types of errors
  err = errors(err);

  // Send detailed error for development or local environment
  if (configs.env === "local" || configs.env === "development") {
    sendDevError(err, res);
  } 
  // Send generic error for production or QA environments
  else if (configs.env === "qa" || configs.env === "production") {
    sendProdError(err, res);
  }
};
