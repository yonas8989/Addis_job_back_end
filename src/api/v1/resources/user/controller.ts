import { RequestHandler } from "express";
import { ICreateUser, IUserLogin, IVerifyOtp } from "./dto";
import { hashPayload } from "../../../../utils/hashPayload";
import { generateOtp } from "../../../../utils/generateOtp";
import { UserDal } from "./dal";
import { compareSync } from "bcryptjs";
import AppError from "../../../../utils/app_error";
import { generateToken } from "../../../../utils/token";
import { SessionsDal } from "../sessions/dal";
import { deviceInfo } from "../../../../utils/deviceInfo";
import { deviceIdGenerator } from "../../../../utils/deviceIdGenerator";

// Create user handler
export const createUser: RequestHandler = async (req, res, next) => {
  try {
    const data = <ICreateUser>req.value;

    // Hash the password
    const password = hashPayload(data.password);

    // Generate and hash OTP
    const otp = generateOtp();
    const hashedOtp = hashPayload(otp);
    const otpExpiresIn = new Date(Date.now() + 1 * 60 * 1000); // 1 minute expiry

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

    // Log OTP (should be sent via SMS/Email in real app)
    console.log(otp);

    // Respond with success message
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

// OTP verification handler
export const verifyOtp: RequestHandler = async (req, res, next) => {
  try {
    const data = <IVerifyOtp>req.value;

    // Retrieve user
    const userData = await UserDal.getUser(req.params.userId);
    if (!userData) return next(new AppError("User does not exists.", 404));

    // Check if OTP exists
    if (!userData.otp || !userData.otpExpiresIn)
      return next(
        new AppError("OTP can not be found. Please request again.", 400)
      );

    // Validate OTP
    if (!compareSync(data.otp, userData.otp))
      return next(new AppError("Invalid OTP.", 400));

    // Check OTP expiration
    const otpExpiresIn = userData.otpExpiresIn.getTime();
    const currentDate = new Date().getTime();
    if (otpExpiresIn < currentDate)
      return next(new AppError("OTP has expired. Please request again.", 400));

    // Mark user as verified
    const user = await UserDal.verifyUser(userData.id);
    if (!user) return next(new AppError("User does not exists.", 404));

    // Send success response
    res.status(200).json({
      status: "SUCCESS",
      message: "You have successfully verified your account.",
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

// User login handler
export const userLogin: RequestHandler = async (req, res, next) => {
  try {
    console.log('Login attempt with data:', req.value);
    const data = <IUserLogin>req.value;

    // Get user by email or phone
    const user = await UserDal.getUserByEmailOrPhoneNumber(
      data.emailOrPhoneNumber
    );
    console.log('User found:', user ? 'Yes' : 'No');
    
    // Check credentials
    if (!user || !compareSync(data.password, user.password)) {
      console.log('Login failed: Invalid credentials');
      return next(new AppError("Invalid Login Credentials.", 400));
    }

    // Reset flags if changed
    if (user.isEmailOrPhoneNumberChanged) {
      await UserDal.updateIsEmailOrPhoneNumberChanged(user.id, false);
    }

    if (user.isPasswordChanged) {
      await UserDal.updateIsPasswordChanged(user.id, false);
    }

    // Limit to 3 sessions per user
    const userSessions = await SessionsDal.getUserSessions(user.id);
    if (userSessions.length >= 3)
      return next(
        new AppError(
          "Maximum number of sessions for this user has reached.",
          400
        )
      );

    // Determine if session is the owner's first
    let isOwner = false;
    if (userSessions.length === 0) {
      isOwner = true;
    }

    // Get user-agent string
    let userAgent = "Unknown";
    if (req.headers["user-agent"]) {
      userAgent = req.headers["user-agent"];
    }

    // Generate device ID and create session
    let deviceId = deviceIdGenerator(user.id);
    const session = await SessionsDal.createSession({
      userId: user.id,
      deviceId,
      deviceInfo: deviceInfo(userAgent),
      expireDate: new Date(Date.now() + 20 * 60 * 1000), // 20 minutes
      isOwner,
    });

    // Generate access token
    const token = generateToken(user.id, "user", deviceId);

    // Respond with token, user, and session
    res.status(200).json({
      status: "SUCCESS",
      data: {
        user,
      },
      token,
      session,
    });
  } catch (error) {
    next(error);
  }
};

// Request new OTP handler
export const requestOtp: RequestHandler = async (req, res, next) => {
  try {
    // Get user by ID
    const userData = await UserDal.getUser(req.params.userId);
    if (!userData) return next(new AppError("User does not exists.", 404));

    // Reject if user is already verified
    if (userData.isVerified)
      return next(new AppError("You account is already verified.", 400));

    // Generate new OTP
    const otp = generateOtp();
    const hashedOtp = hashPayload(otp);
    const otpExpiresIn = new Date(Date.now() + 1 * 60 * 1000); // 1 minute

    // Update OTP in DB
    const user = await UserDal.updateOtp(
      req.params.userId,
      hashedOtp,
      otpExpiresIn
    );
    if (!user) return next(new AppError("User does not exists.", 404));

    // Log OTP (should be sent via SMS/Email in real app)
    console.log(otp);

    // Send response
    res.status(200).json({
      status: "SUCCESS",
      message: "You have recieved an OTP via SMS or Email.",
    });
  } catch (error) {
    next(error);
  }
};

// Get single user info
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
