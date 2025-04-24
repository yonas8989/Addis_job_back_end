import { ICreateSession, IDestroySession } from "./dto"; // Interfaces for session creation and destruction
import { ISessionsDocument } from "./schema"; // Session document interface
import { SessionsModel } from "./model"; // Mongoose model for sessions
import { APIFeatures } from "../../../../utils/apiFeatures"; // Utility class for filtering, sorting, and pagination

export class SessionsDal {
  // Create a new session
  static async createSession(data: ICreateSession): Promise<ISessionsDocument> {
    try {
      const session = await SessionsModel.create({
        user: data.userId,
        deviceId: data.deviceId,
        deviceInfo: data.deviceInfo,
        expireDate: data.expireDate,
        isOwner: data.isOwner,
      });
      return session;
    } catch (error) {
      throw error;
    }
  }

  // Get all sessions with optional filtering and pagination
  static async getAllSessions(
    query?: RequestQuery
  ): Promise<{ sessions: ISessionsDocument[]; totalResults: number }> {
    try {
      const apiFeatures = new APIFeatures<ISessionsDocument>(
        SessionsModel.find(),
        query
      )
        .filter() // Apply filtering
        .sort() // Apply sorting
        .project() // Select specific fields
        .paginate(); // Apply pagination

      const sessions = await apiFeatures.dbQuery; // Execute the query
      const totalResults = await SessionsModel.countDocuments(); // Count total documents
      return { sessions, totalResults };
    } catch (error) {
      throw error;
    }
  }

  // Get all sessions for a specific user
  static async getUserSessions(userId: string): Promise<ISessionsDocument[]> {
    try {
      const sessions = await SessionsModel.find({ user: userId });
      return sessions;
    } catch (error) {
      throw error;
    }
  }

  // Get a session by its ID
  static async getSession(id: string): Promise<ISessionsDocument | null> {
    try {
      const session = await SessionsModel.findById(id);
      return session;
    } catch (error) {
      throw error;
    }
  }

  // Get a session by user ID and device ID
  static async getSessionByUserAndDeviceId(
    userId: string,
    deviceId: string
  ): Promise<ISessionsDocument | null> {
    try {
      const session = await SessionsModel.findOne({ user: userId, deviceId });
      return session;
    } catch (error) {
      throw error;
    }
  }

  // Destroy a session based on user ID and device ID
  static async destroySession(data: {
    userId: string;
    deviceId: string;
  }): Promise<ISessionsDocument | null> {
    try {
      const session = await SessionsModel.findOneAndDelete({
        user: data.userId,
        deviceId: data.deviceId,
      });
      return session;
    } catch (error) {
      throw error;
    }
  }

  // Delete a session by its ID
  static async deleteSession(id: string): Promise<ISessionsDocument | null> {
    try {
      const session = await SessionsModel.findByIdAndDelete(id);
      return session;
    } catch (error) {
      throw error;
    }
  }

  // Update the expiration date of a session
  static async updateSessionExpireDate(
    id: string,
    expireDate: Date
  ): Promise<ISessionsDocument | null> {
    try {
      const session = await SessionsModel.findByIdAndUpdate(
        id,
        { expireDate },
        { runValidators: true, new: true }
      );
      return session;
    } catch (error) {
      throw error;
    }
  }
}
