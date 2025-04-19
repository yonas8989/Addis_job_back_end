/**
 * Data Access Layer (DAL) for User operations
 * This class handles all database operations related to users
 */
import { ICreateUser } from "./dto";
import { UserModel } from "./model";
import { IUserDocument } from "./schema";

export class UserDal {
  /**
   * Creates a new user in the database
   * @param data - User data including OTP information
   * @returns Promise resolving to the created user document
   */
  static async createUser(
    data: ICreateUser & { otp: string; otpExpiresIn: Date }
  ): Promise<IUserDocument> {
    try {
      const user = await UserModel.create(data);
      return user;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retrieves a user by their email or phone number
   * @param emailOrPhoneNumber - Email address or phone number to search for
   * @returns Promise resolving to the user document or null if not found
   * @note Includes password field in the returned document
   */
  static async getUserByEmailOrPhoneNumber(
    emailOrPhoneNumber: string
  ): Promise<IUserDocument | null> {
    try {
      const user = await UserModel.findOne({
        $or: [
          { email: emailOrPhoneNumber },
          { phoneNumber: emailOrPhoneNumber },
        ],
      }).select("+password");
      return user;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retrieves a user by their ID
   * @param id - MongoDB document ID of the user
   * @returns Promise resolving to the user document or null if not found
   */
  static async getUser(id: string): Promise<IUserDocument | null> {
    try {
      const user = await UserModel.findById(id);
      return user;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Updates the OTP (One-Time Password) for a user
   * @param id - MongoDB document ID of the user
   * @param otp - New OTP value
   * @param otpExpiresIn - Expiration date for the OTP
   * @returns Promise resolving to the updated user document or null if not found
   */
  static async updateOtp(
    id: string,
    otp: string,
    otpExpiresIn: Date
  ): Promise<IUserDocument | null> {
    try {
      const user = await UserModel.findByIdAndUpdate(
        id,
        { otp, otpExpiresIn },
        { runValidators: true, new: true }
      );
      return user;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Updates the email/phone number change status for a user
   * @param id - MongoDB document ID of the user
   * @param isEmailOrPhoneNumberChanged - Boolean indicating if email/phone was changed
   * @returns Promise resolving to the updated user document or null if not found
   */
  static async updateIsEmailOrPhoneNumberChanged(
    id: string,
    isEmailOrPhoneNumberChanged: boolean
  ): Promise<IUserDocument | null> {
    try {
      const user = await UserModel.findByIdAndUpdate(
        id,
        { isEmailOrPhoneNumberChanged },
        { runValidators: true, new: true }
      );
      return user;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Updates the password change status for a user
   * @param id - MongoDB document ID of the user
   * @param isPasswordChanged - Boolean indicating if password was changed
   * @returns Promise resolving to the updated user document or null if not found
   */
  static async updateIsPasswordChanged(
    id: string,
    isPasswordChanged: boolean
  ): Promise<IUserDocument | null> {
    try {
      const user = await UserModel.findByIdAndUpdate(
        id,
        { isPasswordChanged },
        { runValidators: true, new: true }
      );
      return user;
    } catch (error) {
      throw error;
    }
  }
}
