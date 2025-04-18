"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../../config"));
exports.default = (err, req, res, next) => {
    // Set default status code and status if not provided
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "ERROR";
    // Development environment: Send detailed error information
    if (config_1.default.env === "development") {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            error: err, // Full error object
            stack: err.stack // Error stack trace
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
