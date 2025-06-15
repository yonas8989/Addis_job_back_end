import { RequestHandler } from "express";
import { ICreateYieldPrediction } from "./dto";
import { YieldDal } from "./dal";
import AppError from "../../../../utils/app_error";
import { predictYield } from "../../../../utils/yieldService";
import { parse } from "csv-parse";
import * as XLSX from "xlsx";
import { yieldPredictionValidation } from "./validation";

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
      NAME: data.name,
      ELEVATION: data.elevation,
      Year: data.year,
      PRECIP: data.precipitation,
      RELHUM: data.relativeHumidity,
      SUNHRS: data.sunshineHours,
      TMPMIN: data.temperatureMin,
      TMPMAX: data.temperatureMax,
      WINDLY: data.windSpeed,
    });

    // Create yield prediction in database
    const prediction = await YieldDal.createYieldPrediction({
      ...data,
      userId,
      predictedYield,
      predictionDate: new Date(),
    });

    // Respond with success message
    res.status(200).json({
      status: "SUCCESS",
      message: "Yield prediction created successfully.",
      data: { prediction },
    });
  } catch (error) {
    next(error);
  }
};

// File upload handler
export const uploadYieldData: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user) {
      return next(new AppError("User not authenticated.", 401));
    }
    const userId = req.user.id;

    if (!req.file) {
      return next(new AppError("No file uploaded.", 400));
    }

    const file = req.file;
    const fileType = file.mimetype;
    let records: ICreateYieldPrediction[] = [];

    // Parse CSV file
    if (fileType === "text/csv") {
      records = await new Promise((resolve, reject) => {
        const results: ICreateYieldPrediction[] = [];
        parse(file.buffer.toString(), { columns: true, skip_empty_lines: true })
          .on("data", (row) => {
            results.push({
              name: row.name,
              elevation: Number(row.elevation),
              year: Number(row.year),
              precipitation: Number(row.precipitation),
              relativeHumidity: Number(row.relativeHumidity),
              sunshineHours: Number(row.sunshineHours),
              temperatureMin: Number(row.temperatureMin),
              temperatureMax: Number(row.temperatureMax),
              windSpeed: Number(row.windSpeed),
            });
          })
          .on("end", () => resolve(results))
          .on("error", (error) => reject(error));
      });
    }
    // Parse Excel file
    else if (
      fileType === "application/vnd.ms-excel" ||
      fileType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      const workbook = XLSX.read(file.buffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      records = XLSX.utils.sheet_to_json(sheet).map((row: any) => ({
        name: row.name,
        elevation: Number(row.elevation),
        year: Number(row.year),
        precipitation: Number(row.precipitation),
        relativeHumidity: Number(row.relativeHumidity),
        sunshineHours: Number(row.sunshineHours),
        temperatureMin: Number(row.temperatureMin),
        temperatureMax: Number(row.temperatureMax),
        windSpeed: Number(row.windSpeed),
      }));
    } else {
      return next(new AppError("Invalid file type. Please upload a CSV or Excel file.", 400));
    }

    // Validate and process each record
    const predictions = [];
    for (const data of records) {
      // Validate data using Joi schema
      const { error } = yieldPredictionValidation.validate(data);
      if (error) {
        return next(new AppError(`Validation error: ${error.message}`, 400));
      }

      // Create yield prediction in database without calling ML API
      const prediction = await YieldDal.createYieldPrediction({
        ...data,
        userId,
        predictedYield: undefined, // Set to undefined since ML API is not called
        predictionDate: new Date(),
      });

      predictions.push(prediction);
    }

    // Respond with success message
    res.status(200).json({
      status: "SUCCESS",
      message: `Successfully stored ${predictions.length} yield records.`,
      data: { predictions },
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
      data: { history },
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
      data: { prediction },
    });
  } catch (error) {
    next(error);
  }
};