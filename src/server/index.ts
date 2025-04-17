// Import required modules
import { createServer } from "http";
import app from "./app";
import db from "./db";

// Default export function that sets up and starts the server
export default () => {
    // Set port from environment variable or default to 3000
    const port = (process.env.PORT as unknown as number) || 3000;

    // Create HTTP server using the Express app
    const server = createServer(app);

    // Start listening on the specified port
    server.listen(port, () => {
        console.log(`Listening on ${port}...`);
    })

    // Initialize MongoDB connection
    const mongo = db.mongo();

    // Handle graceful shutdown on SIGINT (Ctrl+C)
    process.on("SIGINT", () => {
        server.close(() => {
            console.log("Server is Closing")
        });
    });
}