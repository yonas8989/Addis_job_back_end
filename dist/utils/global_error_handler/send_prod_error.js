"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Sends error response for production.
 * @param {AppError} err - Error object with details
 * @param {Response} res - Express response object
 */
exports.default = (err, res) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    }
    else {
        res.status(500).json({
            status: "ERROR",
            message: "Opps!! Unknown error",
        });
    }
};
