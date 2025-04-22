import { RequestHandler } from "express";
import { ICreateUser, IUserLogin, IVerifyOtp } from "./dto";
import { hashPayload } from "../../../../utils/hashpayload";
import { generateOtp } from "../../../../utils/generateOtp";
import { UserDal } from "./dal";
import { compareSync } from "bcryptjs";
import AppError from "../../../../utils/app_error";
import { generateToken } from "../../../../utils/token";
import { deviceInfo } from "../../../../utils/deviceInfo";
import { deviceIdGenerator } from "../../../../utils/deviceIdGenerator";

/**
 * Create a new user account
 * This function handles user registration by:
 * 1. Hashing the password
 * 2. Generating an OTP for verification
 * 3. Creating the user in the database
 * 4. Sending the OTP to the user
 */
export const createUser: RequestHandler = async (req, res, next) => {
  try {
    const data = <ICreateUser>req.value;

    // Hash password for secure storage
    const password = hashPayload(data.password);

    // Generate OTP for account verification
    const otp = generateOtp();
    const hashedOtp = hashPayload(otp);
    const otpExpiresIn = new Date(Date.now() + 1 * 60 * 1000); // OTP expires in 1 minute

    // Create user in database
    const user = await UserDal.createUser({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      password,
      otp: hashedOtp,
      otpExpiresIn,
    });

    // Send OTP to user (currently logged to console)
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

/**
 * Verify user account using OTP
 * This function:
 * 1. Validates the OTP
 * 2. Checks if OTP is expired
 * 3. Marks the user as verified if OTP is valid
 */
export const verifyOtp: RequestHandler = async (req, res, next) => {
  try {
    const data = <IVerifyOtp>req.value;

    const userData = await UserDal.getUser(req.params.userId);
    if (!userData) {
      return next(new AppError("User does not exists.", 404));
    }

    // Validate OTP
    if (!userData.otp || !userData.otpExpiresIn) {
      return next(
        new AppError("OTP can not be found. please request again. ", 400)
      );
    }
    if (!compareSync(data.otp, userData.otp)) {
      return next(new AppError("Invalid OTP", 400));
    }

    // Check if OTP is expired
    const otpExpiresIn = userData.otpExpiresIn.getTime();
    const currentDate = new Date().getTime();
    if (otpExpiresIn < currentDate) {
      return next(new AppError("Otp has expired. pelase request again.", 400));
    }

    // Mark user as verified
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

/**
 * Request a new OTP for account verification
 * This function:
 * 1. Generates a new OTP
 * 2. Updates the user's OTP in the database
 * 3. Sends the new OTP to the user
 */
export const requestOtp: RequestHandler = async (req, res, next) => {
  try {
    const userData = await UserDal.getUser(req.params.userId);

    if (!userData) return next(new AppError("User does not exists.", 404));

    if (userData.isVerified)
      return next(new AppError("You account is already verified.", 400));

    // Generate new OTP
    const otp = generateOtp();
    const hashedOtp = hashPayload(otp);
    const otpExpiresIn = new Date(Date.now() + 1 * 60 * 1000);

    // Update user's OTP
    const user = await UserDal.updateOtp(
      req.params.userId,
      hashedOtp,
      otpExpiresIn
    );
    if (!user) return next(new AppError("User does not exists.", 404));

    // Send new OTP
    console.log(otp);

    res.status(200).json({
      status: "SUCCESS",
      message: "You have recieved an OTP via SMS or Email.",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * User login
 * This function:
 * 1. Validates user credentials
 * 2. Checks if account is verified
 * 3. Updates user status if needed
 * 4. Generates a JWT token for authentication
 */
export const userLogin: RequestHandler = async (req, res, next) => {
  try {
    const data = <IUserLogin>req.value;

    // Find user and validate credentials
    const user = await UserDal.getUserByEmailOrPhoneNumber(
      data.emailOrPhoneNumber
    );

    if (!user || !compareSync(data.password, user.password)) {
      return next(new AppError("Invalid Login Credentials.", 400));
    }

    // Check if account is verified
    if (!user.isVerified) {
      return next(new AppError("Please verify your account first.", 400));
    }

    // Update user status if needed
    if (user.isEmailOrPhoneNumberChanged) {
      await UserDal.updateIsEmailOrPhoneNumberChanged(user.id, false);
    }

    if (user.isPasswordChanged) {
      await UserDal.updateIsPasswordChanged(user.id, false);
    }

    // Generate device ID and token
    const deviceId = deviceIdGenerator(user.id);
    const token = generateToken(user.id, user.role, deviceId);

    res.status(200).json({
      status: "SUCCESS",
      message: "Login successful",
      data: {
        user,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user details
 * This function retrieves user information by ID
 */
export const getUser: RequestHandler = async (req, res, next) => {
  try {
    const user = await UserDal.getUser(req.params.userId);
    if (!user) return next(new AppError("User does not exists.", 404));

    res.status(200).json({
      status: "SUCCESS",
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};
