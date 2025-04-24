import { Response } from "express"; // Express Response object
import AppError from "../app_error"; // Custom AppError class

/**
 * Sends error response for production.
 * @param {AppError} err - Error object with details
 * @param {Response} res - Express response object
 */
export default (err: AppError, res: Response) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: "ERROR",
      message: "Opps!! Unknown error",
    });
  }
};
