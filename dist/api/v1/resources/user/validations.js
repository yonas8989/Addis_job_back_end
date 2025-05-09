"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOtpValidation = exports.userLoginValidation = exports.createUserValidation = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createUserValidation = joi_1.default.object({
    firstName: joi_1.default.string().max(50).min(1).required().messages({
        "string.base": "First name should be a string",
        "string.empty": "First name can not be empty",
        "string.min": "First name can not be less than 1 character",
        "string.max": "First name can not exceed 50 characters",
        "any.required": "First name is required",
    }),
    lastName: joi_1.default.string().max(50).min(1).required().messages({
        "string.base": "Last name should be a string",
        "string.empty": "Last name can not be empty",
        "string.min": "Last name can not be less than 1 character",
        "string.max": "Last name can not exceed 50 characters",
        "any.required": "Last name is required",
    }),
    email: joi_1.default.string().email().required().messages({
        "string.base": "Email should be a string",
        "string.empty": "Email can not be empty",
        "string.email": "Email must be a valid email",
        "any.required": "Email is required",
    }),
    phoneNumber: joi_1.default.string().max(15).min(10).required().messages({
        "string.base": "Phone number should be a string",
        "string.empty": "Phone number can not be empty",
        "string.min": "Phone number can not be less than 10 characters",
        "string.max": "Phone number can not exceed 15 characters",
        "any.required": "Phone number is required",
    }),
    password: joi_1.default.string().min(8).required().messages({
        "string.base": "Password should be a string",
        "string.empty": "Password can not be empty",
        "string.min": "Password can not be less than 8 characters",
        "any.required": "Password is required",
    }),
    confirmPassword: joi_1.default.string().valid(joi_1.default.ref("password")).required().messages({
        "any.required": "Password confirm is required",
        "any.only": "Passwords do not match",
    }),
});
exports.userLoginValidation = joi_1.default.object({
    emailOrPhoneNumber: joi_1.default.alternatives()
        .try(joi_1.default.string().email().required().messages({
        "string.base": "Email should be a string",
        "string.empty": "Email can not be empty",
        "string.email": "Email must be a valid email",
        "any.required": "Email is required",
    }), joi_1.default.string().max(15).min(10).required().messages({
        "string.base": "Phone number should be a string",
        "string.empty": "Phone number can not be empty",
        "string.min": "Phone number can not be less than 10 characters",
        "string.max": "Phone number can not exceed 15 characters",
        "any.required": "Phone number is required",
    }))
        .required()
        .messages({
        "any.required": "Email or phone number is required",
    }),
    password: joi_1.default.string().min(8).required().messages({
        "string.base": "Password should be a string",
        "string.empty": "Password can not be empty",
        "string.min": "Password can not be less than 8 characters",
        "any.required": "Password is required",
    }),
});
exports.verifyOtpValidation = joi_1.default.object({
    otp: joi_1.default.string().max(4).min(4).required().messages({
        "string.base": "OTP should be a string",
        "string.empty": "OTP can not be empty",
        "string.max": "OTP can not exceed 4 characters",
        "string.min": "OTP can not be less than 4 characters",
        "any.required": "OTP is required",
    }),
});
