// Importing RequestHandler type from Express for defining middleware
import { RequestHandler } from "express";

// Importing Joi and its Schema type for validation
import Joi, { Schema } from "joi";

// Custom error class for consistent error handling throughout the app
import AppError from "../../../../utils/app_error";

/**
 * Middleware for validating incoming request bodies using Joi schemas.
 * 
 * @param {Schema} validationSchema - Joi schema to validate against `req.body`
 * @returns {RequestHandler} An Express middleware that validates request data
 * 
 * Usage example:
 *   const schema = Joi.object({ name: Joi.string().required() });
 *   app.post("/api/example", validator(schema), handlerFunction);
 */
export const validator = (validationSchema: Schema): RequestHandler => {
  return (req, res, next) => {
    // Validate the request body against the provided Joi schema
    const { error, value } = validationSchema.validate(req.body);

    // If validation fails, forward a 400 Bad Request error with the validation message
    if (error) return next(new AppError(error.message, 400));

    // Attach the validated value to the request object for use in the next middleware/handler
    req.value = value;

    // Proceed to the next middleware or route handler
    next();
  };
};
