import { RequestHandler } from "express";
import AppError from "../../../../utils/app_error";
import { verifyToken } from "../../../../utils/token";
import { UserDal } from "../user/dal";

/**
 * Middleware to protect routes by verifying JWT tokens and basic user status
 * 
 * This middleware does the following:
 * - Verifies the existence and validity of a token
 * - Checks if the user exists and is active
 * - Attaches the authenticated user to the request object
 */
export const protect: RequestHandler = async (req, res, next) => {
  try {
    let token;

    // Check for Bearer token in the Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // If token is not found, throw an error
    if (!token) {
      return next(new AppError("Please log in to access this resource", 401));
    }

    // Decode and verify the JWT token
    const decoded = verifyToken(token);

    // Retrieve the user by ID from the token payload
    const user = await UserDal.getUser(decoded.id);
    if (!user) {
      return next(new AppError("User not found", 404));
    }

    // Ensure the account is active
    if (!user.isActive) {
      return next(new AppError("Your account is not active", 403));
    }

    // Check for recent sensitive changes that might require re-authentication
    if (user.isEmailOrPhoneNumberChanged) {
      return next(
        new AppError(
          "Recent account changes detected. Please log in again",
          401
        )
      );
    }

    if (user.isPasswordChanged) {
      return next(
        new AppError(
          "You recently changed your password. Please log in again",
          401
        )
      );
    }

    // Attach the authenticated user to the request object
    req.user = user;

    // Continue to the next middleware/route handler
    next();
  } catch (error) {
    // Pass any errors to the error handler middleware
    next(error);
  }
};