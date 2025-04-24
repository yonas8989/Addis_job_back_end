// Load environment variables from a .env file
import { config } from "dotenv";
config();

// Set the API URL based on the environment
let api_url = <string>process.env.API_URL_LOCAL;
if (<string>process.env.NODE_ENV === "development") {
  api_url = <string>process.env.API_URL_DEVELOPMENT;
} else if (<string>process.env.NODE_ENV === "qa") {
  api_url = <string>process.env.API_URL_QA;
} else if (<string>process.env.NODE_ENV === "production") {
  api_url = <string>process.env.API_URL_PROD;
}

// Export configurations
export default {
  env: <string>process.env.NODE_ENV,  // Current environment
  db: {
    remote: <string>process.env.DB_REMOTE,  // Remote database connection URL
  },
  api_key: <string>process.env.API_KEY,  // API key
  delete_key: <string>process.env.DELETE_KEY,  // Delete key
  jwt: {
    expiresin: <string>process.env.JWT_EXPIRESIN,  // JWT expiration time
    secret: <string>process.env.JWT_SECRET,  // JWT secret key
  },
};
