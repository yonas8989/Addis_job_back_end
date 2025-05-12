"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Load environment variables from a .env file
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
// Set the API URL based on the environment
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
// Export configurations
exports.default = {
    env: process.env.NODE_ENV,
    db: {
        remote: process.env.DB_REMOTE,
    },
    api_key: process.env.API_KEY,
    delete_key: process.env.DELETE_KEY,
    jwt: {
        expiresin: process.env.JWT_EXPIRESIN,
        secret: process.env.JWT_SECRET,
    },
    // Add these new configurations
    frontend_url: process.env.FRONTEND_URL || "http://localhost:5173",
    flask_api_url: process.env.FLASK_API_URL || "http://localhost:5001",
    cors: {
        allowedOrigins: [
            process.env.FRONTEND_URL || "http://localhost:5173",
            // Add other allowed origins if needed
        ],
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "x-api-key"]
    }
};
