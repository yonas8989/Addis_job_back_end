import { IUserDocument } from "../../api/v1/resources/user/schema";

export {};

declare global {
  namespace Express {
    interface Request {
      admin: object; // Custom property for storing admin-related data
      user: IUserDocument;  // Custom property for storing user-related data
      value: object; // Custom property for storing validation-related data
    }
  }
}
