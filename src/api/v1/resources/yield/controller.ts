import { RequestHandler } from "express";
import { ICreateYieldPrediction } from "./dto";
import { YieldDal } from "./dal";
import AppError from "../../../../utils/app_error";
import { predictYield } from "../../../../utils/yieldService";

// Create yield prediction handler
export const createYieldPrediction: RequestHandler = async (req, res, next) => {
  try {
    const data = <ICreateYieldPrediction>req.value;
    if (!req.user) {
      return next(new AppError("User not authenticated.", 401));
    }
    const userId = req.user.id;

    // Call Flask API to get predicted yield
    const predictedYield = await predictYield({
      humidity: data.weatherConditions.humidity,
      temperatureMax: data.weatherConditions.temperatureMax,
      temperatureMin: data.weatherConditions.temperatureMin,
      windSpeed: data.weatherConditions.windSpeed,
    });

    // Create yield prediction in database
    const prediction = await YieldDal.createYieldPrediction({
      ...data,
      userId,
      predictedYield, // Use value from Flask API
      predictionDate: new Date(),
    });

    // Respond with success message
    res.status(200).json({
      status: "SUCCESS",
      message: "Yield prediction created successfully.",
      data: {
        prediction,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get yield prediction history handler
export const getYieldHistory: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user) {
      return next(new AppError("User not authenticated.", 401));
    }
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;

    // Fetch yield prediction history
    const history = await YieldDal.getYieldHistory(userId, {
      page: parseInt(page as string),
      limit: parseInt(limit as string),
    });

    // Respond with history
    res.status(200).json({
      status: "SUCCESS",
      data: {
        history,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get single yield prediction handler
export const getYieldPrediction: RequestHandler = async (req, res, next) => {
  try {
    const prediction = await YieldDal.getYieldPrediction(req.params.id);
    if (!prediction) return next(new AppError("Yield prediction not found.", 404));

    if (!req.user) {
      return next(new AppError("User not authenticated.", 401));
    }

    // Ensure the user owns the prediction
    if (prediction.userId.toString() !== req.user.id) {
      return next(new AppError("Unauthorized access to prediction.", 403));
    }

    res.status(200).json({
      status: "SUCCESS",
      data: {
        prediction,
      },
    });
  } catch (error) {
    next(error);
  }
};