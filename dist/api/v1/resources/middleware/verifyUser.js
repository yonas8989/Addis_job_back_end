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
exports.verifyUser = void 0;
// Custom error handler used to throw standardized errors
const app_error_1 = __importDefault(require("../../../../utils/app_error"));
/**
 * Middleware to ensure that a user can only access their own data.
 *
 * This is typically used in routes where users fetch, update, or delete their own records.
 *
 * Example usage:
 *   app.get("/api/v1/user/:userId/profile", protect, verifyUser, controller);
 *
 * Logic:
 *   - Checks if the authenticated user's ID matches the ID in the URL parameter.
 *   - Throws an error if the user tries to access someone else's data.
 */
const verifyUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Cast the authenticated user object to our defined IUserDocument interface
        const user = req.user;
        // Extract the userId from the route parameter
        const userId = req.params.userId;
        // Ensure both user object and route param exist
        if (user && userId) {
            // If the user is trying to access someone else's data, deny access
            if (user.id !== userId)
                return next(new app_error_1.default("You can not access other users' data.", 400));
        }
        else {
            // If user info or userId is missing, respond with not found
            return next(new app_error_1.default("Unable to find user.", 404));
        }
        // If everything checks out, proceed to the next middleware or route handler
        next();
    }
    catch (error) {
        // Catch and forward any unexpected errors
        next(error);
    }
});
exports.verifyUser = verifyUser;
