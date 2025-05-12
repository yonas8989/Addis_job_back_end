import axios from "axios";
import AppError from "../utils/app_error";
import config from "../config";

export const predictYield = async (weatherData: {
  humidity: number;
  temperatureMax: number;
  temperatureMin: number;
  windSpeed: number;
}) => {
  try {
    const response = await axios.post(
      `${config.flask_api_url}/predict`,
      weatherData,
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": config.api_key, // Authentication for Flask API
        },
      }
    );

    // Normalize status to handle both "success" (mock) and "SUCCESS" (potential Flask API)
    const status = response.data.status?.toLowerCase();
    if (!status || status !== "success") {
      throw new AppError(
        `Prediction failed: ${response.data.error || "Unknown error"}`,
        400
      );
    }

    // Validate prediction value
    if (typeof response.data.prediction !== "number" || isNaN(response.data.prediction)) {
      throw new AppError("Invalid prediction value received", 400);
    }

    return response.data.prediction;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.error || error.message;
      const status = error.response?.status || 500;
      throw new AppError(`ML API Error: ${message}`, status);
    }
    throw error;
  }
};