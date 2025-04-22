import { Application, Request, Response } from "express";
import { sessions, user } from "../../api/v1/resources";

/**
 * Route based on the version of the API
 * @param {Application} app
 * @returns {}
 */
export default (app: Application) => {
  // Test route
  app.get("/api/v1/test", (req: Request, res: Response) => {
    res.status(200).json({
      status: "success",
      message: "API v1 is working",
    });
  });
  app.use("/api/v1/user", user);
  app.use("/api/v1/sessions", sessions);
  
};
