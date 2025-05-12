export interface ICreateYieldPrediction {
  cropType: string;
  fieldSize: number; // in hectares
  soilType: string;
  weatherConditions: {
    temperatureMax: number; // in Celsius
    temperatureMin: number; // in Celsius
    humidity: number; // in percentage
    windSpeed: number; // in km/h
  };
  predictedYield?: number; // Optional, will be set by Flask API
}