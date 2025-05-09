"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Sends detailed error response for development.
 * @param {AppError} err - Error object with details
 * @param {Response} res - Express response object
 */
exports.default = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        error: err,
        errorStack: err.stack,
    });
};
