import { ICreateYieldPrediction } from "./dto";
import { YieldModel } from "./model";
import { IYieldDocument } from "./schema";

export class YieldDal {
  // Create a new yield prediction
  static async createYieldPrediction(
    data: ICreateYieldPrediction & {
      userId: string;
      predictionDate: Date;
      predictedYield: number; // Ensure predictedYield is required
    }
  ): Promise<IYieldDocument> {
    try {
      const prediction = await YieldModel.create(data);
      return prediction;
    } catch (error) {
      throw error;
    }
  }

  // Get yield prediction history for a user
  static async getYieldHistory(
    userId: string,
    options: { page: number; limit: number }
  ): Promise<IYieldDocument[]> {
    try {
      const { page, limit } = options;
      const predictions = await YieldModel.find({ userId })
        .sort({ predictionDate: -1 }) // Sort by newest first
        .skip((page - 1) * limit)
        .limit(limit);
      return predictions;
    } catch (error) {
      throw error;
    }
  }

  // Get a yield prediction by ID
  static async getYieldPrediction(id: string): Promise<IYieldDocument | null> {
    try {
      const prediction = await YieldModel.findById(id);
      return prediction;
    } catch (error) {
      throw error;
    }
  }
}