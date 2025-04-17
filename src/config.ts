/**
 * Configuration module for managing environment variables and application settings
 * This file handles different environment configurations and exports them for use throughout the application
 */

import {config} from 'dotenv';
config();

// Determine the API URL based on the current environment
// Defaults to local environment if no specific environment is set
let api_url = <string>process.env.API_URL_LOCAL;
if (<string>process.env.NODE_ENV === "development") {
  api_url = <string>process.env.API_URL_DEVELOPMENT;
} else if (<string>process.env.NODE_ENV === "qa") {
  api_url = <string>process.env.API_URL_QA;
} else if (<string>process.env.NODE_ENV === "production") {
  api_url = <string>process.env.API_URL_PROD;
}

// Main configuration object that exports all environment-specific settings
export default {
    // Current environment (development, qa, production)
    env: <string>process.env.NODE_ENV,
    
    // Database configuration
    db: {
      // Remote database connection string
      remote: <string>process.env.DB_REMOTE,
    },
    
    // API authentication key
    api_key: <string>process.env.API_KEY,
    
    // Key used for secure deletion operations
    delete_key: <string>process.env.DELETE_KEY,
    
    // JWT (JSON Web Token) configuration
    jwt: {
      // Token expiration time
      expiresin: <string>process.env.JWT_EXPIRESIN,
      // Secret key for JWT signing
      secret: <string>process.env.JWT_SECRET,
    },
  };