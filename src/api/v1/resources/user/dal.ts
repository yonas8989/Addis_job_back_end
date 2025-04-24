import { ICreateUser } from "./dto";
import { UserModel } from "./model";
import { IUserDocument } from "./schema";

export class UserDal {
  // Create a new user with OTP
  static async createUser(
    data: ICreateUser & { otp: string; otpExpiresIn: Date }
  ): Promise<IUserDocument> {
    try {
      const user = await UserModel.create(data); // Create user in the database
      return user;
    } catch (error) {
      throw error; // Throw any errors encountered
    }
  }

  // Get user by email or phone number, including password field
  static async getUserByEmailOrPhoneNumber(
    emailOrPhoneNumber: string
  ): Promise<IUserDocument | null> {
    try {
      const user = await UserModel.findOne({
        $or: [
          { email: emailOrPhoneNumber },
          { phoneNumber: emailOrPhoneNumber },
        ],
      }).select("+password"); // Include the password field in the result
      return user;
    } catch (error) {
      throw error; // Throw any errors encountered
    }
  }

  // Get a user by their ID
  static async getUser(id: string): Promise<IUserDocument | null> {
    try {
      const user = await UserModel.findById(id); // Find user by ID
      return user;
    } catch (error) {
      throw error; // Throw any errors encountered
    }
  }

  // Update OTP for a user
  static async updateOtp(
    id: string,
    otp: string,
    otpExpiresIn: Date
  ): Promise<IUserDocument | null> {
    try {
      const user = await UserModel.findByIdAndUpdate(
        id,
        { otp, otpExpiresIn }, // Update OTP and its expiration
        { runValidators: true, new: true } // Run validation and return updated user
      );
      return user;
    } catch (error) {
      throw error; // Throw any errors encountered
    }
  }

  // Verify user and clear OTP
  static async verifyUser(id: string): Promise<IUserDocument | null> {
    try {
      const user = await UserModel.findByIdAndUpdate(
        id,
        { isVerified: true, otp: null, otpExpiresIn: null }, // Mark user as verified and clear OTP
        { runValidators: true, new: true } // Run validation and return updated user
      );
      return user;
    } catch (error) {
      throw error; // Throw any errors encountered
    }
  }

  // Update the email or phone number change flag
  static async updateIsEmailOrPhoneNumberChanged(
    id: string,
    isEmailOrPhoneNumberChanged: boolean
  ): Promise<IUserDocument | null> {
    try {
      const user = await UserModel.findByIdAndUpdate(
        id,
        { isEmailOrPhoneNumberChanged }, // Update the change flag
        { runValidators: true, new: true } // Run validation and return updated user
      );
      return user;
    } catch (error) {
      throw error; // Throw any errors encountered
    }
  }

  // Update the password change flag
  static async updateIsPasswordChanged(
    id: string,
    isPasswordChanged: boolean
  ): Promise<IUserDocument | null> {
    try {
      const user = await UserModel.findByIdAndUpdate(
        id,
        { isPasswordChanged }, // Update the change flag
        { runValidators: true, new: true } // Run validation and return updated user
      );
      return user;
    } catch (error) {
      throw error; // Throw any errors encountered
    }
  }
}
