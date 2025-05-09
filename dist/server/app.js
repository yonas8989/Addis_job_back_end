"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_error_1 = __importDefault(require("../utils/app_error"));
const global_error_handler_1 = __importDefault(require("../utils/global_error_handler"));
const config_1 = __importDefault(require("../config"));
const express_1 = __importDefault(require("express"));
const routes_1 = require("./routes");
const cors_1 = __importDefault(require("cors")); // Now properly typed after installing @types/cors
const app = (0, express_1.default)();
// CORS Middleware
app.use((0, cors_1.default)({
    origin: config_1.default.cors.allowedOrigins,
    methods: config_1.default.cors.methods,
    allowedHeaders: config_1.default.cors.allowedHeaders,
    credentials: true
}));
// Built-in middlewares
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
// API Key middleware
app.use((req, res, next) => {
    const apiKey = req.headers["x-api-key"];
    if (!apiKey)
        return next(new app_error_1.default("Please provide the API Key", 400));
    if (config_1.default.api_key !== apiKey)
        return next(new app_error_1.default("Invalid API Key", 400));
    next();
});
// Routes
(0, routes_1.v1)(app);
// 404 Handler
app.use("*", (req, res, next) => {
    return next(new app_error_1.default(`Unknown URL`, 404));
});
// Global error handler
app.use(global_error_handler_1.default);
exports.default = app;
