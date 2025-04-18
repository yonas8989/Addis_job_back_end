"use strict";
/**
 * Configuration module for managing environment variables and application settings
 * This file handles different environment configurations and exports them for use throughout the application
 */
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
// Determine the API URL based on the current environment
// Defaults to local environment if no specific environment is set
let api_url = process.env.API_URL_LOCAL;
if (process.env.NODE_ENV === "development") {
    api_url = process.env.API_URL_DEVELOPMENT;
}
else if (process.env.NODE_ENV === "qa") {
    api_url = process.env.API_URL_QA;
}
else if (process.env.NODE_ENV === "production") {
    api_url = process.env.API_URL_PROD;
}
// Main configuration object that exports all environment-specific settings
exports.default = {
    // Current environment (development, qa, production)
    env: process.env.NODE_ENV,
    // Database configuration
    db: {
        // Remote database connection string
        remote: process.env.DB_REMOTE,
    },
    // API authentication key
    api_key: process.env.API_KEY,
    // Key used for secure deletion operations
    delete_key: process.env.DELETE_KEY,
    // JWT (JSON Web Token) configuration
    jwt: {
        // Token expiration time
        expiresin: process.env.JWT_EXPIRESIN,
        // Secret key for JWT signing
        secret: process.env.JWT_SECRET,
    },
};
