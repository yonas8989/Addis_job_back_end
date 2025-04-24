import { Response } from "express"; // Express Response object
import AppError from "../app_error"; // Custom AppError class

/**
 * Sends detailed error response for development.
 * @param {AppError} err - Error object with details
 * @param {Response} res - Express response object
 */
export default (err: AppError, res: Response) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    errorStack: err.stack,
  });
};
