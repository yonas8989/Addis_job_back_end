"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const app_1 = __importDefault(require("./app"));
const db_1 = __importDefault(require("./db"));
/**
 * Initializes and starts the server, connecting to the database.
 * Handles server shutdown gracefully on SIGINT.
 */
exports.default = () => {
    const port = process.env.PORT || 3000;
    const server = (0, http_1.createServer)(app_1.default);
    // Start server
    server.listen(port, () => {
        console.log(`Listening on ${port}...`);
    });
    // Connect to MongoDB
    const mongo = db_1.default.mongo();
    // Graceful shutdown on SIGINT
    process.on("SIGINT", () => {
        server.close(() => {
            console.log("Server is closing");
        });
    });
};
