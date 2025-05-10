import { YieldModel } from './model';
import { IYieldDocument } from './schema';
import { IYieldPredictionRequest } from './dto';

export class YieldDal {
  static async createYieldPrediction(
    data: IYieldPredictionRequest & { 
      predictedYield: number; 
      userId: string 
    }
  ): Promise<IYieldDocument> {
    return YieldModel.create(data);
  }

  static async getYieldHistory(
    userId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<IYieldDocument[]> {
    const query: any = { userId };
    
    if (startDate && endDate) {
      query.createdAt = { $gte: startDate, $lte: endDate };
    }

    return YieldModel.find(query).sort({ createdAt: -1 });
  }

  static async getYieldPredictionById(
    id: string
  ): Promise<IYieldDocument | null> {
    return YieldModel.findById(id);
  }
}