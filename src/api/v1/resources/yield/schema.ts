import { Schema, Document } from 'mongoose';

export interface IYieldDocument extends Document {
  humidity: number;
  temperatureMax: number;
  temperatureMin: number;
  windSpeed: number;
  predictedYield: number;
  userId: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export const yieldSchema = new Schema(
  {
    humidity: { type: Number, required: true },
    temperatureMax: { type: Number, required: true },
    temperatureMin: { type: Number, required: true },
    windSpeed: { type: Number, required: true },
    predictedYield: { type: Number, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);