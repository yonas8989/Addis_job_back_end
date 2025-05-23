import Joi from "joi";

export const yieldPredictionValidation = Joi.object({
  name: Joi.string().max(100).required().messages({
    "string.base": "Location name should be a string",
    "string.empty": "Location name cannot be empty",
    "string.max": "Location name cannot exceed 100 characters",
    "any.required": "Location name is required",
  }),
  elevation: Joi.number().min(0).required().messages({
    "number.base": " elevation should be a number",
    "number.min": " elevation cannot be negative",
    "any.required": " elevation is required",
  }),
  year: Joi.number().min(1900).required().messages({
    "number.base": "Year should be a number",
    "number.min": "Year must be at least 1900",
    "any.required": "Year is required",
  }),
  precipitation: Joi.number().min(0).required().messages({
    "number.base": "Precipitation should be a number",
    "number.min": "Precipitation cannot be negative",
    "any.required": "Precipitation is required",
  }),
  relativeHumidity: Joi.number().min(0).max(100).required().messages({
    "number.base": "Relative humidity should be a number",
    "number.min": "Relative humidity cannot be negative",
    "number.max": "Relative humidity cannot exceed 100%",
    "any.required": "Relative humidity is required",
  }),
  sunshineHours: Joi.number().min(0).required().messages({
    "number.base": "Sunshine hours should be a number",
    "number.min": "Sunshine hours cannot be negative",
    "any.required": "Sunshine hours are required",
  }),
  temperatureMin: Joi.number().required().messages({
    "number.base": "Minimum temperature should be a number",
    "any.required": "Minimum temperature is required",
  }),
  temperatureMax: Joi.number().required().messages({
    "number.base": "Maximum temperature should be a number",
    "any.required": "Maximum temperature is required",
  }),
  windSpeed: Joi.number().min(0).required().messages({
    "number.base": "Wind speed should be a number",
    "number.min": "Wind speed cannot be negative",
    "any.required": "Wind speed is required",
  }),
  predictedYield: Joi.number().min(0).optional().messages({
    "number.base": "Predicted yield should be a number",
    "number.min": "Predicted yield cannot be negative",
  }),
});

export const yieldHistoryValidation = Joi.object({
  page: Joi.number().min(1).default(1).messages({
    "number.base": "Page should be a number",
    "number.min": "Page must be at least 1",
  }),
  limit: Joi.number().min(1).max(100).default(10).messages({
    "number.base": "Limit should be a number",
    "number.min": "Limit must be at least 1",
    "number.max": "Limit cannot exceed 100",
  }),
});