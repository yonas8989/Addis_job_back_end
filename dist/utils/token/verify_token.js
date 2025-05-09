"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = require("jsonwebtoken");
const config_1 = __importDefault(require("../../config"));
/**
 * Verify token
 * @param {string} token
 * @returns {JwtPayload} Jwt payload
 */
exports.default = (token) => {
    return (0, jsonwebtoken_1.verify)(token, config_1.default.jwt.secret);
};
