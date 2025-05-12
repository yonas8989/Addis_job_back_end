"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.yieldHistoryValidation = exports.yieldPredictionValidation = void 0;
const joi_1 = __importDefault(require("joi"));
exports.yieldPredictionValidation = joi_1.default.object({
    cropType: joi_1.default.string().max(50).required().messages({
        "string.base": "Crop type should be a string",
        "string.empty": "Crop type cannot be empty",
        "string.max": "Crop type cannot exceed 50 characters",
        "any.required": "Crop type is required",
    }),
    fieldSize: joi_1.default.number().min(0.1).required().messages({
        "number.base": "Field size should be a number",
        "number.min": "Field size must be at least 0.1 hectares",
        "any.required": "Field size is required",
    }),
    soilType: joi_1.default.string().max(50).required().messages({
        "string.base": "Soil type should be a string",
        "string.empty": "Soil type cannot be empty",
        "string.max": "Soil type cannot exceed 50 characters",
        "any.required": "Soil type is required",
    }),
    weatherConditions: joi_1.default.object({
        temperature: joi_1.default.number().required().messages({
            "number.base": "Temperature should be a number",
            "any.required": "Temperature is required",
        }),
        rainfall: joi_1.default.number().min(0).required().messages({
            "number.base": "Rainfall should be a number",
            "number.min": "Rainfall cannot be negative",
            "any.required": "Rainfall is required",
        }),
        humidity: joi_1.default.number().min(0).max(100).required().messages({
            "number.base": "Humidity should be a number",
            "number.min": "Humidity cannot be negative",
            "number.max": "Humidity cannot exceed 100%",
            "any.required": "Humidity is required",
        }),
    }).required().messages({
        "any.required": "Weather conditions are required",
    }),
    predictedYield: joi_1.default.number().min(0).required().messages({
        "number.base": "Predicted yield should be a number",
        "number.min": "Predicted yield cannot be negative",
        "any.required": "Predicted yield is required",
    }),
});
exports.yieldHistoryValidation = joi_1.default.object({
    page: joi_1.default.number().min(1).default(1).messages({
        "number.base": "Page should be a number",
        "number.min": "Page must be at least 1",
    }),
    limit: joi_1.default.number().min(1).max(100).default(10).messages({
        "number.base": "Limit should be a number",
        "number.min": "Limit must be at least 1",
        "number.max": "Limit cannot exceed 100",
    }),
});
