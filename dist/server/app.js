"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import necessary modules and utilities
const app_error_1 = __importDefault(require("../utils/app_error"));
const global_error_handler_1 = __importDefault(require("../utils/global_error_handler"));
const config_1 = __importDefault(require("../config"));
const express_1 = __importDefault(require("express"));
// Initialize Express application
const app = (0, express_1.default)();
// Configure middleware for parsing JSON and URL-encoded data
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
// API key authentication middleware
app.use((req, res, next) => {
    const apiKey = req.headers["x-api-key"];
    if (!apiKey) {
        return next(new app_error_1.default("pleaser provide the API key ", 400));
    }
    if (config_1.default.api_key !== apiKey) {
        return next(new app_error_1.default("InValid API key", 400));
    }
    ;
    next();
});
// Mount version 1 routes
// v1(app);
// Handle unknown routes
app.use("*", (req, res, next) => {
    return next(new app_error_1.default("Unknown URL", 404));
});
// Global error handler
app.use(global_error_handler_1.default);
// Export the configured Express application
exports.default = app;
