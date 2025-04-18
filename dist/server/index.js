"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import required modules
const http_1 = require("http");
const app_1 = __importDefault(require("./app"));
const db_1 = __importDefault(require("./db"));
// Default export function that sets up and starts the server
exports.default = () => {
    // Set port from environment variable or default to 3000
    const port = process.env.PORT || 3000;
    // Create HTTP server using the Express app
    const server = (0, http_1.createServer)(app_1.default);
    // Start listening on the specified port
    server.listen(port, () => {
        console.log(`Listening on ${port}...`);
    });
    // Initialize MongoDB connection
    const mongo = db_1.default.mongo();
    // Handle graceful shutdown on SIGINT (Ctrl+C)
    process.on("SIGINT", () => {
        server.close(() => {
            console.log("Server is Closing");
        });
    });
};
