export interface ICreateYieldPrediction {
  cropType: string;
  fieldSize: number; // in hectares
  soilType: string;
  weatherConditions: {
    temperature: number; // in Celsius
    rainfall: number; // in mm
    humidity: number; // in percentage
  };
  predictedYield: number; // in tons per hectare
}