import { Application } from "express";
import { user, sessions , yields} from "../../api/v1/resources";

/**
 * Route based on the version of the API
 * @param {Application} app
 * @returns {}
 */
export default (app: Application) => {
  app.use("/api/v1/user", user);
  app.use("/api/v1/sessions", sessions);
  app.use("/api/v1/yields", yields);
};
