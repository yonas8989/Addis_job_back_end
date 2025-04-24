import { createServer } from "http";
import app from "./app";
import db from "./db";

/**
 * Initializes and starts the server, connecting to the database.
 * Handles server shutdown gracefully on SIGINT.
 */
export default () => {
  const port = (process.env.PORT as unknown as number) || 3000;

  const server = createServer(app);

  // Start server
  server.listen(port, () => {
    console.log(`Listening on ${port}...`);
  });

  // Connect to MongoDB
  const mongo = db.mongo();

  // Graceful shutdown on SIGINT
  process.on("SIGINT", () => {
    server.close(() => {
      console.log("Server is closing");
    });
  });
};
