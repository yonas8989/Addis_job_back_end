
import { ISessionsDocument } from "./schema";
import { SessionsModel } from "./model";
import { APIFeatures } from "../../../../utils/apiFeatures";

export class SessionsDal {
    static async getAllSessions(
        query?: RequestQuery
      ): Promise<{ sessions: ISessionsDocument[]; totalResults: number }> {
        try {
          const apiFeatures = new APIFeatures<ISessionsDocument>(
            SessionsModel.find(),
            query
          )
            .filter()
            .sort()
            .project()
            .paginate();
          const sessions = await apiFeatures.dbQuery;
          const totalResults = await SessionsModel.countDocuments();
          return { sessions, totalResults };
        } catch (error) {
          throw error;
        }
      }
}
