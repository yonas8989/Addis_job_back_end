import { ICreateUser } from "./dto";
import { UserModel } from "./model";
import { IUserDocument } from "./schema";

export class UserDal {
  static async createUser(data: ICreateUser): Promise<IUserDocument> {
    const user = await UserModel.create(data);
    return user;
  }

  static async getUserByEmailOrPhoneNumber(
    emailOrPhoneNumber: string
  ): Promise<IUserDocument | null> {
    const user = await UserModel.findOne({
      $or: [
        { email: emailOrPhoneNumber },
        { phoneNumber: emailOrPhoneNumber },
      ],
    }).select("+password");
    return user;
  }

  static async getUser(id: string): Promise<IUserDocument | null> {
    const user = await UserModel.findById(id);
    return user;
  }
}