import { RequestHandler } from "express";
import { IUserDocument } from "../user/schema";
import AppError from "../../../../utils/app_error";

export const verfyUser: RequestHandler = async (req, res, next) => {
  try {
    const user = <IUserDocument>req.value;
    const userId = req.params.userId;

    if (user && userId) {
      if (user.id! == userId) {
        return next(new AppError("You can not access other user's data.", 400));
      } else {
        next(new AppError("unable to find user.", 404));
      }
    }
    next();
  } catch (error) {
    next(error);
  }
};
