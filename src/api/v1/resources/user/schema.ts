import { Document, Schema } from "mongoose";

export interface IUserDocument extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: string;
  isEmailOrPhoneNumberChanged: boolean;
  isPasswordChanged: boolean;
  isVerified: boolean;
  isActive: boolean;
  otp: string;
  otpExpiresIn: Date;
  passwordResetToken: string;
  passwordResetTokenExpiresIn: string;
  lastActivityDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

// User schema definition
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
    // Add to the userSchema
    profilePicture: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true, // Email must be unique
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required."],
      unique: true, // Phone number must be unique
    },
    role: {
      type: String,
      default: "User", // Default role is "User"
    },
    password: {
      type: String,
      required: [true, "Password is required."],
      select: false, // Don't include the password field by default in queries
    },
    isEmailOrPhoneNumberChanged: {
      type: Boolean,
      default: false, // Flag for whether email/phone number has been changed
    },
    isPasswordChanged: {
      type: Boolean,
      default: false, // Flag for whether the password has been changed
    },
    isVerified: {
      type: Boolean,
      default: false, // Default is unverified user
    },
    isActive: {
      type: Boolean,
      default: true, // Default is active user
    },
    otp: String, // OTP for user verification
    otpExpiresIn: Date, // OTP expiration date
    passwordResetToken: String, // Token for password reset
    passwordResetTokenExpiresIn: Date, // Expiration date for the reset token
    lastActivityDate: Date, // Timestamp for last activity
  },

  {
    writeConcern: {
      w: "majority", // Ensures writes are acknowledged by a majority of nodes
      j: true, // Journal writes to ensure durability
    },
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);
