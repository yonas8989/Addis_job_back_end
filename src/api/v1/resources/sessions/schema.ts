import mongoose, { Document, Schema } from "mongoose";

// Interface representing a session document in MongoDB
export interface ISessionsDocument extends Document {
  user: string;          // Reference to the user who owns the session
  deviceId: string;      // Unique ID of the user's device
  deviceInfo: string;    // Information about the user's device (e.g., browser, OS)
  expireDate: Date;      // When the session expires
  isOwner: boolean;      // Whether this session is the owner's main session
  createdAt: Date;       // Automatically generated timestamp for document creation
  updatedAt: Date;       // Automatically generated timestamp for document update
}

// Mongoose schema defining the structure of session documents
export const sessionsSchema = new Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: [true, "User is required."],
    },
    deviceId: {
      type: String,
      required: [true, "Device ID is required."],
    },
    deviceInfo: {
      type: String,
      required: [true, "Device info is required."],
    },
    expireDate: {
      type: Date,
      required: [true, "Expire date is required."],
    },
    isOwner: {
      type: Boolean,
      dafault: false, // NOTE: Typo here; should be "default"
    },
  },
  {
    writeConcern: {
      w: "majority", // Wait for majority of nodes to acknowledge the write
      j: true,       // Wait for journal commit for durability
    },
    timestamps: true, // Automatically adds `createdAt` and `updatedAt`
  }
);
