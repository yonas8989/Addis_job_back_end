// Importing RequestHandler type from Express for typing middleware functions
import { RequestHandler } from "express";

// Importing the custom user document interface, which includes fields like user role
import { IUserDocument } from "../user/schema";

// Importing a custom error handler class used to throw standardized application errors
import AppError from "../../../../utils/app_error";

/**
 * Authorization middleware to restrict access to specific roles.
 * 
 * @param roles - An array of allowed user roles (e.g., ["admin", "manager"]).
 * @returns An Express middleware function that checks the user's role against allowed roles.
 * 
 * Usage:
 *   router.get("/admin-data", auth("admin"), controllerFunction);
 */
export const auth = (...roles: string[]): RequestHandler => {
  return (req, res, next) => {
    // Check if the user is authenticated and present on the request object
    if (req.user) {
      // Cast req.user to IUserDocument for type safety and access to `role`
      const user = <IUserDocument>req.user;

      // Check if the user's role is included in the list of allowed roles
      if (!roles.includes(user.role)) {
        // If not authorized, pass a custom AppError to the error handler middleware
        return next(new AppError("Access Denied.", 400));
      }

      // If authorized, proceed to the next middleware or route handler
      next();
    } else {
      // If no user information is found in the request, throw an authorization error
      return next(new AppError("Unable to perform authorization.", 400));
    }
  };
};
