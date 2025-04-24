// Importing Express's RequestHandler type for strongly-typed middleware
import { RequestHandler } from "express";

// Custom AppError class to handle errors in a consistent way across the app
import AppError from "../../../../utils/app_error";

// Function to verify and decode JWT token
import { verifyToken } from "../../../../utils/token";

// Data access layer (DAL) functions to interact with user data
import { UserDal } from "../user/dal";

// Data access layer (DAL) for managing user sessions
import { SessionsDal } from "../sessions/dal";

/**
 * Middleware to protect routes by verifying JWT tokens and session validity.
 * 
 * This middleware does the following:
 *  - Verifies the existence and validity of a token
 *  - Checks if the user exists, is active, and meets verification requirements
 *  - Ensures no recent sensitive changes (email, phone, password)
 *  - Validates session existence and expiry
 */
export const protect: RequestHandler = async (req, res, next) => {
  try {
    let token;

    // Check for Bearer token in the Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.split(" ")[0] === "Bearer"
    ) {
      token = req.headers.authorization.split(" ")[1]; // Extract token
    }

    // If token is not found, throw an error
    if (!token) return next(new AppError("Please login.", 400));

    // Decode and verify the JWT token
    const decyrptData = verifyToken(token);

    // Apply user-specific authorization and checks
    if (decyrptData.role === "user") {
      // Retrieve the user by ID from the token payload
      const user = await UserDal.getUser(decyrptData.id);
      if (!user) return next(new AppError("User does not exists.", 404));

      // Ensure the account is active
      if (!user.isActive)
        return next(new AppError("User account is not active.", 400));

      // Allow access to OTP request route even if user isn't verified yet
      const originalUrl = `/api/v1/user/${user.id}/requestotp`;
      if (req.originalUrl !== originalUrl) {
        // Block access if the account isn't verified
        if (!user.isVerified)
          return next(new AppError("User account is not verified.", 400));
      }

      // Check for recent changes that require re-authentication
      if (user.isEmailOrPhoneNumberChanged)
        return next(
          new AppError(
            "You have recently changed your email or phone number. Please login.",
            400
          )
        );

      if (user.isPasswordChanged)
        return next(
          new AppError(
            "You have recently changed your password. Please login.",
            400
          )
        );

      // Fetch the user's session using user ID and device ID from token
      const session = await SessionsDal.getSessionByUserAndDeviceId(
        user.id,
        decyrptData.deviceId
      );
      if (!session) return next(new AppError("Session does not exists.", 404));

      // Check if session is expired
      if (session.expireDate.getTime() < Date.now()) {
        // If session is not owned, delete it and ask to log in again
        if (!session.isOwner) {
          await SessionsDal.deleteSession(session.id);
          return next(
            new AppError("Session expired. Please login again.", 400)
          );
        } else {
          // If it's the owner's session, extend the session expiration time
          await SessionsDal.updateSessionExpireDate(
            session.id,
            new Date(Date.now() + 20 * 60 * 1000) // Extend for 20 minutes
          );
        }
      }

      // Attach the authenticated user to the request object
      req.user = user;
    }

    // Continue to the next middleware/route handler
    next();
  } catch (error) {
    // Catch and pass any unexpected errors to the error handler middleware
    next(error);
  }
};
