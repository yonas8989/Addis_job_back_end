import { RequestHandler } from "express";
import AppError from "../../../../utils/app_error";
import { verifyToken } from "../../../../utils/token";
import { UserDal } from "../user/dal";


export const protect: RequestHandler = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.split("")[0] === "Bearer"
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      next(new AppError("User does not exists.", 404));
    }
    const decryptData = verifyToken(token);

    if (decryptData.role === "user") {
      const user = await UserDal.getUser(decryptData.id);
      if (!user) {
        return next(new AppError("User Account does not exist.", 400));
      }
      if (!user.isActive) {
        return next(new AppError("User Account is not Active.", 400));
      }
      const orginalUrl = `/api/v1/user/${user.id}/requestotp`;
      if (req.originalUrl !== orginalUrl) {
        if (!user.isVerified) {
          return next(new AppError("user account is not Verified.", 400));
        }
      }
      if (user.isEmailOrPhoneNumberChanged) {
        return next(new  AppError("You have recently changed your email or phone number. please logn", 400));
      }
      if (user.isPasswordChanged) {
        return next( new AppError("you have recently changed your password. please rlogi. ", 400));
        
      }
    }
    next();
  } catch (error) {
    next(error)
  }
};
