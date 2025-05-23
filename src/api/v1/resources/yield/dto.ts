export interface ICreateYieldPrediction {
  name: string; // e.g., "Gondar A.P."
  elevation: number; // in meters
  year: number;
  precipitation: number; // in mm
  relativeHumidity: number; // in percentage
  sunshineHours: number; // in hours
  temperatureMin: number; // in Celsius
  temperatureMax: number; // in Celsius
  windSpeed: number; // in km/h
  predictedYield?: number; // Optional, set by Flask API
}