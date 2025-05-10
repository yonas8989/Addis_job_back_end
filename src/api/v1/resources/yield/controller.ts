import { RequestHandler } from 'express';
import { YieldDal } from './dta';
import { predictYield } from '../../../../utils/yieldService';
import AppError from '../../../../utils/app_error';
import { IYieldPredictionRequest } from './dto';

export const createYieldPrediction: RequestHandler = async (req, res, next) => {
  try {
    const data = req.body as IYieldPredictionRequest;
    
    // Authentication check
    if (!req.user) {
      return next(new AppError('Authentication required', 401));
    }
    const userId = req.user.id;

    // Input validation
    if (!data.humidity || !data.temperatureMax || !data.temperatureMin || !data.windSpeed) {
      return next(new AppError('All weather parameters are required', 400));
    }

    // Get prediction from ML service
    const predictedYield = await predictYield(data);

    // Save to database
    const yieldRecord = await YieldDal.createYieldPrediction({
      ...data,
      predictedYield,
      userId
    });

    res.status(201).json({
      status: 'SUCCESS',
      data: {
        yield: yieldRecord
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getYieldHistory: RequestHandler = async (req, res, next) => {
  try {
    // Authentication check
    if (!req.user) {
      return next(new AppError('Authentication required', 401));
    }
    const userId = req.user.id;

    const { startDate, endDate } = req.query;

    // Date validation
    if (startDate && isNaN(Date.parse(startDate as string))) {
      return next(new AppError('Invalid start date format', 400));
    }
    if (endDate && isNaN(Date.parse(endDate as string))) {
      return next(new AppError('Invalid end date format', 400));
    }

    const history = await YieldDal.getYieldHistory(
      userId,
      startDate ? new Date(startDate as string) : undefined,
      endDate ? new Date(endDate as string) : undefined
    );

    res.status(200).json({
      status: 'SUCCESS',
      results: history.length,
      data: {
        history
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getYieldPrediction: RequestHandler = async (req, res, next) => {
  try {
    // Authentication check (if prediction is user-specific)
    if (!req.user) {
      return next(new AppError('Authentication required', 401));
    }

    const prediction = await YieldDal.getYieldPredictionById(req.params.id);
    if (!prediction) {
      return next(new AppError('Yield prediction not found', 404));
    }

    // Optional: Verify prediction belongs to user
    if (prediction.userId.toString() !== req.user.id) {
      return next(new AppError('Unauthorized to access this prediction', 403));
    }

    res.status(200).json({
      status: 'SUCCESS',
      data: {
        prediction
      }
    });
  } catch (error) {
    next(error);
  }
};