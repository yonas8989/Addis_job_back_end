"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const send_dev_error_1 = __importDefault(require("./send_dev_error"));
const send_prod_error_1 = __importDefault(require("./send_prod_error"));
const config_1 = __importDefault(require("../../config"));
const errors_1 = __importDefault(require("./errors"));
// Global error handler
exports.default = (err, req, res, next) => {
    // Set default status code and status if not already provided
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "ERROR";
    // Handle specific types of errors
    err = (0, errors_1.default)(err);
    // Send detailed error for development or local environment
    if (config_1.default.env === "local" || config_1.default.env === "development") {
        (0, send_dev_error_1.default)(err, res);
    }
    // Send generic error for production or QA environments
    else if (config_1.default.env === "qa" || config_1.default.env === "production") {
        (0, send_prod_error_1.default)(err, res);
    }
};
