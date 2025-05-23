import axios from "axios";
import AppError from "../utils/app_error";
import config from "../config";

export const predictYield = async (data: {
  NAME: string;
  ELEVATION: number;
  Year: number;
  PRECIP: number;
  RELHUM: number;
  SUNHRS: number;
  TMPMIN: number;
  TMPMAX: number;
  WINDLY: number;
}) => {
  try {
    const response = await axios.post(
      "http://localhost:5001/predict",
      {
        NAME: data.NAME,
        ELEVATION: data.ELEVATION,
        Year: data.Year,
        PRECIP: data.PRECIP,
        RELHUM: data.RELHUM,
        SUNHRS: data.SUNHRS,
        TMPMIN: data.TMPMIN,
        TMPMAX: data.TMPMAX,
        WINDLY: data.WINDLY,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": config.api_key, // Authentication for Flask API
        },
      }
    );

    // Normalize status to handle "success"
    const status = response.data.status?.toLowerCase();
    if (!status || status !== "success") {
      throw new AppError(
        `Prediction failed: ${response.data.error || "Unknown error"}`,
        400
      );
    }

    // Validate prediction value
    if (
      typeof response.data.predicted_yield !== "number" ||
      isNaN(response.data.predicted_yield)
    ) {
      throw new AppError("Invalid prediction value received", 400);
    }

    return response.data.predicted_yield;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.error || error.message;
      const status = error.response?.status || 500;
      throw new AppError(`ML API Error: ${message}`, status);
    }
    throw error;
  }
};