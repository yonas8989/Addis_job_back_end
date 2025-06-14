import { Document, Schema } from "mongoose";

export interface IUserDocument extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: string;
  isActive: boolean;
  isEmailOrPhoneNumberChanged: boolean;
  isPasswordChanged: boolean;
  createdAt: Date;
  updatedAt: Date;
}

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
      unique: true,
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required."],
      unique: true,
    },
    role: {
      type: String,
      default: "User",
    },
    password: {
      type: String,
      required: [true, "Password is required."],
      select: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isEmailOrPhoneNumberChanged: {
      type: Boolean,
      default: false,
    },
    isPasswordChanged: {
      type: Boolean,
      default: false,
    },
  },
  {
    writeConcern: {
      w: "majority",
      j: true,
    },
    timestamps: true,
  }
);