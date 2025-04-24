import AppError from "../app_error";

/**
 * Create custom errors
 * @param {AppError} err
 * @returns {AppError} err object
 */
export default (err: AppError): AppError => {
  // Handle database validation errors (e.g., mongoose validation errors)
  if (err.name === "ValidationError") {
    console.log(err);
    return new AppError("DB validation error", 400);
  }

  // Handle JWT errors (invalid token)
  if (err.name === "JsonWebTokenError") {
    return new AppError("Invalid token", 400);
  }

  // Handle JWT errors (token expired)
  if (err.name === "TokenExpiredError") {
    return new AppError("Token expired", 400);
  }

  // Handle errors related to invalid document ID (CastError)
  if (err.name === "CastError") {
    return new AppError("Invalid document ID", 400);
  }

  // Handle MongoDB duplicate key errors (e.g., unique fields like email, phone number)
  if (err.message.includes("11000")) {
    if (err.message.includes("email")) {
      return new AppError("Email already exists", 400);
    } else if (err.message.includes("phone_number")) {
      return new AppError("Phone number already exists", 400);
    } else if (err.message.includes("title")) {
      return new AppError("Title already exists", 400);
    } else if (err.message.includes("links")) {
      return new AppError("Link URL already exists", 400);
    } else if (err.message.includes("rank")) {
      return new AppError("Rank of the team member already exists", 400);
    } else if (err.message.includes("name")) {
      return new AppError("Name already exists", 400);
    }
  }

  // Return the original error if no custom handling is defined
  return err;
};
