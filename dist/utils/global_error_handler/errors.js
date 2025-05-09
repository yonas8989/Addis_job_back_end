"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_error_1 = __importDefault(require("../app_error"));
/**
 * Create custom errors
 * @param {AppError} err
 * @returns {AppError} err object
 */
exports.default = (err) => {
    // Handle database validation errors (e.g., mongoose validation errors)
    if (err.name === "ValidationError") {
        console.log(err);
        return new app_error_1.default("DB validation error", 400);
    }
    // Handle JWT errors (invalid token)
    if (err.name === "JsonWebTokenError") {
        return new app_error_1.default("Invalid token", 400);
    }
    // Handle JWT errors (token expired)
    if (err.name === "TokenExpiredError") {
        return new app_error_1.default("Token expired", 400);
    }
    // Handle errors related to invalid document ID (CastError)
    if (err.name === "CastError") {
        return new app_error_1.default("Invalid document ID", 400);
    }
    // Handle MongoDB duplicate key errors (e.g., unique fields like email, phone number)
    if (err.message.includes("11000")) {
        if (err.message.includes("email")) {
            return new app_error_1.default("Email already exists", 400);
        }
        else if (err.message.includes("phone_number")) {
            return new app_error_1.default("Phone number already exists", 400);
        }
        else if (err.message.includes("title")) {
            return new app_error_1.default("Title already exists", 400);
        }
        else if (err.message.includes("links")) {
            return new app_error_1.default("Link URL already exists", 400);
        }
        else if (err.message.includes("rank")) {
            return new app_error_1.default("Rank of the team member already exists", 400);
        }
        else if (err.message.includes("name")) {
            return new app_error_1.default("Name already exists", 400);
        }
    }
    // Return the original error if no custom handling is defined
    return err;
};
