import { RequestHandler } from "express";
import { SessionsDal } from "./dal";

// Get all sessions
export const getAllSessions: RequestHandler = async (req, res, next) => {
    try {
      const { sessions, totalResults } = await SessionsDal.getAllSessions(
        req.query
      );
  
      res.status(200).json({
        status: "SUCCESS",
        results: sessions.length,
        totalResults,
        data: {
          sessions,
        },
      });
    } catch (error) {
      next(error);
    }
  };
