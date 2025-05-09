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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDal = void 0;
const model_1 = require("./model");
class UserDal {
    // Create a new user with OTP
    static createUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield model_1.UserModel.create(data); // Create user in the database
                return user;
            }
            catch (error) {
                throw error; // Throw any errors encountered
            }
        });
    }
    // Get user by email or phone number, including password field
    static getUserByEmailOrPhoneNumber(emailOrPhoneNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield model_1.UserModel.findOne({
                    $or: [
                        { email: emailOrPhoneNumber },
                        { phoneNumber: emailOrPhoneNumber },
                    ],
                }).select("+password"); // Include the password field in the result
                return user;
            }
            catch (error) {
                throw error; // Throw any errors encountered
            }
        });
    }
    // Get a user by their ID
    static getUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield model_1.UserModel.findById(id); // Find user by ID
                return user;
            }
            catch (error) {
                throw error; // Throw any errors encountered
            }
        });
    }
    // Update OTP for a user
    static updateOtp(id, otp, otpExpiresIn) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield model_1.UserModel.findByIdAndUpdate(id, { otp, otpExpiresIn }, // Update OTP and its expiration
                { runValidators: true, new: true } // Run validation and return updated user
                );
                return user;
            }
            catch (error) {
                throw error; // Throw any errors encountered
            }
        });
    }
    // Verify user and clear OTP
    static verifyUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield model_1.UserModel.findByIdAndUpdate(id, { isVerified: true, otp: null, otpExpiresIn: null }, // Mark user as verified and clear OTP
                { runValidators: true, new: true } // Run validation and return updated user
                );
                return user;
            }
            catch (error) {
                throw error; // Throw any errors encountered
            }
        });
    }
    // Update the email or phone number change flag
    static updateIsEmailOrPhoneNumberChanged(id, isEmailOrPhoneNumberChanged) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield model_1.UserModel.findByIdAndUpdate(id, { isEmailOrPhoneNumberChanged }, // Update the change flag
                { runValidators: true, new: true } // Run validation and return updated user
                );
                return user;
            }
            catch (error) {
                throw error; // Throw any errors encountered
            }
        });
    }
    // Update the password change flag
    static updateIsPasswordChanged(id, isPasswordChanged) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield model_1.UserModel.findByIdAndUpdate(id, { isPasswordChanged }, // Update the change flag
                { runValidators: true, new: true } // Run validation and return updated user
                );
                return user;
            }
            catch (error) {
                throw error; // Throw any errors encountered
            }
        });
    }
}
exports.UserDal = UserDal;
