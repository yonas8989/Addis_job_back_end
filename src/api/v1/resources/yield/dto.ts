export interface IYieldPredictionRequest {
  humidity: number;
  temperatureMax: number;
  temperatureMin: number;
  windSpeed: number;
}

export interface IYieldPredictionResponse {
  predictedYield: number;
}

export interface IYieldHistoryQuery {
  userId: string;
  startDate?: Date;
  endDate?: Date;
}