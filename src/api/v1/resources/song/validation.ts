import Joi from "joi";

export const createSongValidation = Joi.object({
  title: Joi.string().max(100).required().messages({
    "string.base": "Title should be a string",
    "string.empty": "Title cannot be empty",
    "string.max": "Title cannot exceed 100 characters",
    "any.required": "Title is required",
  }),
  artist: Joi.string().max(100).required().messages({
    "string.base": "Artist should be a string",
    "string.empty": "Artist cannot be empty",
    "string.max": "Artist name cannot exceed 100 characters",
    "any.required": "Artist is required",
  }),
  album: Joi.string().max(100).optional().messages({
    "string.base": "Album should be a string",
    "string.max": "Album name cannot exceed 100 characters",
  }),
  genre: Joi.string()
    .valid(
      "Pop",
      "Rock",
      "Hip-Hop",
      "R&B",
      "Electronic",
      "Jazz",
      "Classical",
      "Country",
      "Other"
    )
    .required()
    .messages({
      "any.only": "Invalid genre selected",
      "any.required": "Genre is required",
    }),
  duration: Joi.number().min(1).required().messages({
    "number.base": "Duration should be a number",
    "number.min": "Duration must be at least 1 second",
    "any.required": "Duration is required",
  }),
  releaseYear: Joi.number()
    .min(1900)
    .max(new Date().getFullYear())
    .optional()
    .messages({
      "number.base": "Release year should be a number",
      "number.min": "Release year must be after 1900",
      "number.max": "Release year cannot be in the future",
    }),
  fileUrl: Joi.string().required().messages({
    "string.base": "File URL should be a string",
    "string.empty": "File URL cannot be empty",
    "any.required": "File URL is required",
  }),
  coverImageUrl: Joi.string().optional().messages({
    "string.base": "Cover image URL should be a string",
  }),
});

export const updateSongValidation = Joi.object({
  title: Joi.string().max(100).optional().messages({
    "string.base": "Title should be a string",
    "string.empty": "Title cannot be empty",
    "string.max": "Title cannot exceed 100 characters",
  }),
  artist: Joi.string().max(100).optional().messages({
    "string.base": "Artist should be a string",
    "string.empty": "Artist cannot be empty",
    "string.max": "Artist name cannot exceed 100 characters",
  }),
  album: Joi.string().max(100).optional().messages({
    "string.base": "Album should be a string",
    "string.max": "Album name cannot exceed 100 characters",
  }),
  genre: Joi.string()
    .valid(
      "Pop",
      "Rock",
      "Hip-Hop",
      "R&B",
      "Electronic",
      "Jazz",
      "Classical",
      "Country",
      "Other"
    )
    .optional()
    .messages({
      "any.only": "Invalid genre selected",
    }),
  duration: Joi.number().min(1).optional().messages({
    "number.base": "Duration should be a number",
    "number.min": "Duration must be at least 1 second",
  }),
  releaseYear: Joi.number()
    .min(1900)
    .max(new Date().getFullYear())
    .optional()
    .messages({
      "number.base": "Release year should be a number",
      "number.min": "Release year must be after 1900",
      "number.max": "Release year cannot be in the future",
    }),
  fileUrl: Joi.string().optional().messages({
    "string.base": "File URL should be a string",
    "string.empty": "File URL cannot be empty",
  }),
  coverImageUrl: Joi.string().optional().messages({
    "string.base": "Cover image URL should be a string",
  }),
});