import { RequestHandler } from "express";
import { ICreateUser, IUserLogin, IVerifyOpt } from "./dto";
import { hashPayload } from "../../../../utils/hasPayload";
import { generateOtp } from "../../../../utils/generateOtp";
import { UserDal } from "./dal";
import { compareSync } from "bcryptjs";
import AppError from "../../../../utils/app_error";
import { generate_token } from "../../../../utils/token";
import { deviceInfo } from "../../../../utils/deviceInfo";
import { deviceIdGenerator } from "../../../../utils/deviceIdGenerator";


// create user
export const createUser: RequestHandler = async (req, res, next) => {
  try {
    const data = <ICreateUser>req.value;

    // hash password
    const password = hashPayload(data.password);

    // generate otp
    const otp = generateOtp();
    const hashedOtp = hashPayload(otp);
    const otpExpiresIn = new Date(Date.now() + 1 * 60 * 1000);

    // Create user
    const user = await UserDal.createUser({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      password,
      otp: hashedOtp,
      otpExpiresIn,
    });

    // send OTP
    console.log(otp);

    res.status(200).json({
      status: "SUCCESS",
      message:
        "User account is successfully created. Please verify your account using the OTP sent to your email or phone number.",
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

//   verify OTP
const verifyOtp: RequestHandler = async (req, res, next) => {
  try {
    const data = <IVerifyOpt>req.value;

    const userData = await UserDal.getUser(req.params.userId);
    if (!userData) {
      return next(new AppError("User does not exists.", 404));
    }
    // compare otp
    if (!userData.otp || !userData.otpExpiresIn) {
      return next(
        new AppError("OTP can not be found. please request again. ", 400)
      );
    }
    if (!compareSync(data.otp, userData.otp)) {
      return next(new AppError("Invalid OTP", 400));
    }

    // expired otp
    const otpExpiresIn = userData.otpExpiresIn.getTime();
    const currentDate = new Date().getTime();
    if (otpExpiresIn < currentDate) {
      return next(new AppError("Otp has expired. pelase request again.", 400));
    }
    const user = await UserDal.verifyUser(userData.id);
    if (!user) {
      return next(new AppError("User does not exists.", 404));
    }

    res.status(200).json({
        status: "SUCCESS",
        message: "You have sucessfully verfied your account",
        data: {
          user,
        },
      });
  } catch (error) {
    next(error);
  }
};

// user login
export const userLogin: RequestHandler = async (req, res, next) => {
  try {
    const data = <IUserLogin>req.value;

    const user = await UserDal.getUserByEmailOrPhoneNumber(
      data.emailOrPhoneNumber
    );

    if(!user || !compareSync(data.password, user.password) ){
        return next(new AppError("Invalid Login Credentials." , 400));
    };
    if(user.isEmailOrPhoneNumberChanged){
        await UserDal.updateIsEmailOrPhoneNumberChanged(user.id, false);
    }
    if (user.isPasswordChanged){
        await UserDal.updateIsPasswordChanged(user.id, false);
    }
  } catch (error) {}
};
