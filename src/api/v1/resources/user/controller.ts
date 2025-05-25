import { RequestHandler } from "express";
import { ICreateUser, IUserLogin } from "./dto";
import { hashPayload } from "../../../../utils/hashPayload";
import { UserDal } from "./dal";
import { compareSync } from "bcryptjs";
import AppError from "../../../../utils/app_error";
import { generateToken } from "../../../../utils/token";

export const createUser: RequestHandler = async (req, res, next) => {
  try {
    const data = <ICreateUser>req.value;

    // Hash the password
    const password = hashPayload(data.password);

    // Create user in database
    const user = await UserDal.createUser({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      password,
    });

    // Respond with success message
    res.status(200).json({
      status: "SUCCESS",
      message: "User account created successfully",
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const userLogin: RequestHandler = async (req, res, next) => {
  try {
    const data = <IUserLogin>req.value;

    // Get user by email or phone
    const user = await UserDal.getUserByEmailOrPhoneNumber(
      data.emailOrPhoneNumber
    );
    
    // Check credentials
    if (!user || !compareSync(data.password, user.password)) {
      return next(new AppError("Invalid login credentials", 400));
    }

    // Generate access token
    const token = generateToken(user.id, "user");

    // Respond with token and user
    res.status(200).json({
      status: "SUCCESS",
      data: {
        user,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const getUser: RequestHandler = async (req, res, next) => {
  try {
    const user = await UserDal.getUser(req.params.userId);
    if (!user) return next(new AppError("User does not exist", 404));

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