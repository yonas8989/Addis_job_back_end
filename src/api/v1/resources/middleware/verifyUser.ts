// Importing Express's RequestHandler type for defining middleware functions
import { RequestHandler } from "express";

// Importing user interface with custom fields, such as `id`, `role`, etc.
import { IUserDocument } from "../user/schema";

// Custom error handler used to throw standardized errors
import AppError from "../../../../utils/app_error";

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
export const verifyUser: RequestHandler = async (req, res, next) => {
  try {
    // Cast the authenticated user object to our defined IUserDocument interface
    const user = <IUserDocument>req.user;

    // Extract the userId from the route parameter
    const userId = req.params.userId;

    // Ensure both user object and route param exist
    if (user && userId) {
      // If the user is trying to access someone else's data, deny access
      if (user.id !== userId)
        return next(new AppError("You can not access other users' data.", 400));
    } else {
      // If user info or userId is missing, respond with not found
      return next(new AppError("Unable to find user.", 404));
    }

    // If everything checks out, proceed to the next middleware or route handler
    next();
  } catch (error) {
    // Catch and forward any unexpected errors
    next(error);
  }
};
