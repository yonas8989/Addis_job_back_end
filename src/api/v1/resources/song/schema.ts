import { Document, Schema } from "mongoose";

export interface ISongDocument extends Document {
  title: string;
  artist: string;
  album?: string;
  genre: string;
  duration: number; // in seconds
  releaseYear?: number;
  fileUrl: string;
  coverImageUrl?: string;
  createdBy: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export const songSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    artist: {
      type: String,
      required: [true, "Artist is required"],
      maxlength: [100, "Artist name cannot exceed 100 characters"],
    },
    album: {
      type: String,
      maxlength: [100, "Album name cannot exceed 100 characters"],
    },
    genre: {
      type: String,
      required: [true, "Genre is required"],
      enum: [
        "Pop",
        "Rock",
        "Hip-Hop",
        "R&B",
        "Electronic",
        "Jazz",
        "Classical",
        "Country",
        "Other",
      ],
    },
    duration: {
      type: Number,
      required: [true, "Duration is required"],
      min: [1, "Duration must be at least 1 second"],
    },
    releaseYear: {
      type: Number,
      min: [1900, "Release year must be after 1900"],
      max: [new Date().getFullYear(), "Release year cannot be in the future"],
    },
    fileUrl: {
      type: String,
      required: [true, "File URL is required"],
    },
    coverImageUrl: {
      type: String,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    writeConcern: {
      w: "majority",
      j: true,
    },
  }
);