import axios from "axios";
import AppError from "../utils/app_error";
import config from "../config";  // Import your config

export const predictYield = async (weatherData: {
  humidity: number;
  temperatureMax: number;
  temperatureMin: number;
  windSpeed: number;
}) => {
  try {
    const response = await axios.post(
      `${config.flask_api_url}/predict`,  // Use from config
      weatherData,
      {
        headers: {
          "Content-Type": "application/json",
          // Add authentication if your Flask API requires it
          "x-api-key": config.api_key  
        }
      }
    );
    
    if (!response.data.status || response.data.status !== "SUCCESS") {
      throw new AppError("Prediction failed", 400);
    }
    
    return response.data.prediction;
    
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new AppError(
        `ML API Error: ${error.response?.data?.error || error.message}`,
        error.response?.status || 500
      );
    }
    throw error;
  }
};