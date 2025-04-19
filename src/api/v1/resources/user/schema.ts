// User schema definition for MongoDB using Mongoose
import { Document, Schema } from "mongoose";

// Interface defining the structure of a User document
export interface IUserDocument extends Document {
  firstName: string;        // User's first name
  lastName: string;         // User's last name
  email: string;           // User's email address (unique)
  phoneNumber: string;     // User's phone number (unique)
  password: string;        // Hashed password
  role: string;            // User's role (default: "User")
  isEmailOrPhoneNumberChanged: boolean;  // Flag for email/phone changes
  isPasswordChanged: boolean;           // Flag for password changes
  isVerified: boolean;     // Email verification status
  isActive: boolean;       // Account active status
  otp: string;            // One-time password for verification
  otpExpiresIn: Date;     // OTP expiration timestamp
  passwordResetToken: string;          // Token for password reset
  passwordResetTokenExpiresIn: string; // Password reset token expiration
  lastActivityDate: Date;  // Last user activity timestamp
  createdAt: Date;        // Document creation timestamp
  updatedAt: Date;        // Document last update timestamp
}

// Mongoose schema definition for User model
export const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required."],
      maxlength: [50, "First name can not exceed 50 characters."],
      minlength: [1, "First name can not be less than 1 character."],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required."],
      maxlength: [50, "Last name can not exceed 50 characters."],
      minlength: [1, "Last name can not be less than 1 character."],
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,  // Ensures email uniqueness in the database
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required."],
      unique: true,  // Ensures phone number uniqueness in the database
    },
    role: {
      type: String,
      default: "User",  // Default role for new users
    },
    password: {
      type: String,
      required: [true, "Password is required."],
      select: false,  // Password is not returned by default in queries
    },
    isEmailOrPhoneNumberChanged: {
      type: Boolean,
      default: false,  // Tracks if email or phone number was changed
    },
    isPasswordChanged: {
      type: Boolean,
      default: false,  // Tracks if password was changed
    },
    isVerified: {
      type: Boolean,
      default: false,  // Email verification status
    },
    isActive: {
      type: Boolean,
      default: true,  // Account active status
    },
    otp: String,  // One-time password for verification
    otpExpiresIn: Date,  // OTP expiration timestamp
    passwordResetToken: String,  // Token for password reset
    passwordResetTokenExpiresIn: Date,  // Password reset token expiration
  },
  {
    writeConcern: {
      w: "majority",  // Ensures write operations are acknowledged by majority of nodes
      j: true,        // Journaling enabled for durability
    },
    timestamps: true,  // Automatically adds createdAt and updatedAt fields
  }
);
