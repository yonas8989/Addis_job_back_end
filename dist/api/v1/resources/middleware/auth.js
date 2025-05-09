"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
// Importing a custom error handler class used to throw standardized application errors
const app_error_1 = __importDefault(require("../../../../utils/app_error"));
/**
 * Authorization middleware to restrict access to specific roles.
 *
 * @param roles - An array of allowed user roles (e.g., ["admin", "manager"]).
 * @returns An Express middleware function that checks the user's role against allowed roles.
 *
 * Usage:
 *   router.get("/admin-data", auth("admin"), controllerFunction);
 */
const auth = (...roles) => {
    return (req, res, next) => {
        // Check if the user is authenticated and present on the request object
        if (req.user) {
            // Cast req.user to IUserDocument for type safety and access to `role`
            const user = req.user;
            // Check if the user's role is included in the list of allowed roles
            if (!roles.includes(user.role)) {
                // If not authorized, pass a custom AppError to the error handler middleware
                return next(new app_error_1.default("Access Denied.", 400));
            }
            // If authorized, proceed to the next middleware or route handler
            next();
        }
        else {
            // If no user information is found in the request, throw an authorization error
            return next(new app_error_1.default("Unable to perform authorization.", 400));
        }
    };
};
exports.auth = auth;
