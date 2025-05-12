import Joi from "joi";

export const yieldPredictionValidation = Joi.object({
  cropType: Joi.string().max(50).required().messages({
    "string.base": "Crop type should be a string",
    "string.empty": "Crop type cannot be empty",
    "string.max": "Crop type cannot exceed 50 characters",
    "any.required": "Crop type is required",
  }),
  fieldSize: Joi.number().min(0.1).required().messages({
    "number.base": "Field size should be a number",
    "number.min": "Field size must be at least 0.1 hectares",
    "any.required": "Field size is required",
  }),
  soilType: Joi.string().max(50).required().messages({
    "string.base": "Soil type should be a string",
    "string.empty": "Soil type cannot be empty",
    "string.max": "Soil type cannot exceed 50 characters",
    "any.required": "Soil type is required",
  }),
  weatherConditions: Joi.object({
    temperatureMax: Joi.number().required().messages({
      "number.base": "Maximum temperature should be a number",
      "any.required": "Maximum temperature is required",
    }),
    temperatureMin: Joi.number().required().messages({
      "number.base": "Minimum temperature should be a number",
      "any.required": "Minimum temperature is required",
    }),
    humidity: Joi.number().min(0).max(100).required().messages({
      "number.base": "Humidity should be a number",
      "number.min": "Humidity cannot be negative",
      "number.max": "Humidity cannot exceed 100%",
      "any.required": "Humidity is required",
    }),
    windSpeed: Joi.number().min(0).required().messages({
      "number.base": "Wind speed should be a number",
      "number.min": "Wind speed cannot be negative",
      "any.required": "Wind speed is required",
    }),
  }).required().messages({
    "any.required": "Weather conditions are required",
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