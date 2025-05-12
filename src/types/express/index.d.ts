import { IUserDocument } from "../user/schema"; // Adjust path to where IUserDocument is defined

export {};

declare global {
  namespace Express {
    interface Request {
      admin?: object; // Keep as object if admin type is not yet defined
      user?: IUserDocument; // Use IUserDocument for user
      value?: object; // Keep as object if value type is generic or not yet defined
    }
  }
}