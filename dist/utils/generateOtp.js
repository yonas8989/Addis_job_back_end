"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOtp = void 0;
const otp_generator_1 = require("otp-generator");
/**
 * Generates a 4-digit OTP.
 * @returns {string} - The generated OTP.
 */
const generateOtp = () => {
    return (0, otp_generator_1.generate)(4, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        digits: true,
        specialChars: false,
    });
};
exports.generateOtp = generateOtp;
