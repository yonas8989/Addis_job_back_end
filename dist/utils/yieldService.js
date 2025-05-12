"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.predictYield = void 0;
const axios_1 = __importDefault(require("axios"));
const app_error_1 = __importDefault(require("../utils/app_error"));
const config_1 = __importDefault(require("../config"));
const predictYield = (weatherData) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        const response = yield axios_1.default.post(`${config_1.default.flask_api_url}/predict`, weatherData, {
            headers: {
                "Content-Type": "application/json",
                "x-api-key": config_1.default.api_key, // Authentication for Flask API
            },
        });
        // Normalize status to handle both "success" (mock) and "SUCCESS" (potential Flask API)
        const status = (_a = response.data.status) === null || _a === void 0 ? void 0 : _a.toLowerCase();
        if (!status || status !== "success") {
            throw new app_error_1.default(`Prediction failed: ${response.data.error || "Unknown error"}`, 400);
        }
        // Validate prediction value
        if (typeof response.data.prediction !== "number" || isNaN(response.data.prediction)) {
            throw new app_error_1.default("Invalid prediction value received", 400);
        }
        return response.data.prediction;
    }
    catch (error) {
        if (axios_1.default.isAxiosError(error)) {
            const message = ((_c = (_b = error.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.error) || error.message;
            const status = ((_d = error.response) === null || _d === void 0 ? void 0 : _d.status) || 500;
            throw new app_error_1.default(`ML API Error: ${message}`, status);
        }
        throw error;
    }
});
exports.predictYield = predictYield;
