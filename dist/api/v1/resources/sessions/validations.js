"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.destroySessionValidation = void 0;
const joi_1 = __importDefault(require("joi"));
exports.destroySessionValidation = joi_1.default.object({
    userId: joi_1.default.string().required().messages({
        "string.base": "User ID should be a string",
        "string.empty": "User ID can not be empty",
        "any.required": "User ID is required",
    }),
    deviceId: joi_1.default.string().required().messages({
        "string.base": "Device ID should be a string",
        "string.empty": "Device ID can not be empty",
        "any.required": "Device ID is required",
    }),
    ownerId: joi_1.default.string().required().messages({
        "string.base": "Owner ID should be a string",
        "string.empty": "Owner ID can not be empty",
        "any.required": "Owner ID is required",
    }),
    ownerDeviceId: joi_1.default.string().required().messages({
        "string.base": "User ID should be a string",
        "string.empty": "User ID can not be empty",
        "any.required": "User ID is required",
    }),
});
