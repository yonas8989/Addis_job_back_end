"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validator = void 0;
// Custom error class for consistent error handling throughout the app
const app_error_1 = __importDefault(require("../../../../utils/app_error"));
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
const validator = (validationSchema) => {
    return (req, res, next) => {
        // Validate the request body against the provided Joi schema
        const { error, value } = validationSchema.validate(req.body);
        // If validation fails, forward a 400 Bad Request error with the validation message
        if (error)
            return next(new app_error_1.default(error.message, 400));
        // Attach the validated value to the request object for use in the next middleware/handler
        req.value = value;
        // Proceed to the next middleware or route handler
        next();
    };
};
exports.validator = validator;
