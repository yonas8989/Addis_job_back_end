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
exports.protect = void 0;
// Custom AppError class to handle errors in a consistent way across the app
const app_error_1 = __importDefault(require("../../../../utils/app_error"));
// Function to verify and decode JWT token
const token_1 = require("../../../../utils/token");
// Data access layer (DAL) functions to interact with user data
const dal_1 = require("../user/dal");
// Data access layer (DAL) for managing user sessions
const dal_2 = require("../sessions/dal");
/**
 * Middleware to protect routes by verifying JWT tokens and session validity.
 *
 * This middleware does the following:
 *  - Verifies the existence and validity of a token
 *  - Checks if the user exists, is active, and meets verification requirements
 *  - Ensures no recent sensitive changes (email, phone, password)
 *  - Validates session existence and expiry
 */
const protect = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let token;
        // Check for Bearer token in the Authorization header
        if (req.headers.authorization &&
            req.headers.authorization.split(" ")[0] === "Bearer") {
            token = req.headers.authorization.split(" ")[1]; // Extract token
        }
        // If token is not found, throw an error
        if (!token)
            return next(new app_error_1.default("Please login.", 400));
        // Decode and verify the JWT token
        const decyrptData = (0, token_1.verifyToken)(token);
        // Apply user-specific authorization and checks
        if (decyrptData.role === "user") {
            // Retrieve the user by ID from the token payload
            const user = yield dal_1.UserDal.getUser(decyrptData.id);
            if (!user)
                return next(new app_error_1.default("User does not exists.", 404));
            // Ensure the account is active
            if (!user.isActive)
                return next(new app_error_1.default("User account is not active.", 400));
            // Allow access to OTP request route even if user isn't verified yet
            const originalUrl = `/api/v1/user/${user.id}/requestotp`;
            if (req.originalUrl !== originalUrl) {
                // Block access if the account isn't verified
                if (!user.isVerified)
                    return next(new app_error_1.default("User account is not verified.", 400));
            }
            // Check for recent changes that require re-authentication
            if (user.isEmailOrPhoneNumberChanged)
                return next(new app_error_1.default("You have recently changed your email or phone number. Please login.", 400));
            if (user.isPasswordChanged)
                return next(new app_error_1.default("You have recently changed your password. Please login.", 400));
            // Fetch the user's session using user ID and device ID from token
            const session = yield dal_2.SessionsDal.getSessionByUserAndDeviceId(user.id, decyrptData.deviceId);
            if (!session)
                return next(new app_error_1.default("Session does not exists.", 404));
            // Check if session is expired
            if (session.expireDate.getTime() < Date.now()) {
                // If session is not owned, delete it and ask to log in again
                if (!session.isOwner) {
                    yield dal_2.SessionsDal.deleteSession(session.id);
                    return next(new app_error_1.default("Session expired. Please login again.", 400));
                }
                else {
                    // If it's the owner's session, extend the session expiration time
                    yield dal_2.SessionsDal.updateSessionExpireDate(session.id, new Date(Date.now() + 20 * 60 * 1000) // Extend for 20 minutes
                    );
                }
            }
            // Attach the authenticated user to the request object
            req.user = user;
        }
        // Continue to the next middleware/route handler
        next();
    }
    catch (error) {
        // Catch and pass any unexpected errors to the error handler middleware
        next(error);
    }
});
exports.protect = protect;
