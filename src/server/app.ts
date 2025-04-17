// Import necessary modules and utilities
import AppError from "../utils/app_error";
import geh from "../utils/global_error_handler";
import config from "../config";
import express, {Application  , NextFunction , Request , Response } from "express";
import { v1 } from "./routes";

// Initialize Express application
const app:Application = express();

// Configure middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({extended:false}));

// API key authentication middleware
app.use((req:Request, res:Response , next:NextFunction) => {
    const apiKey = req.headers["x-api-key"];

    if(!apiKey){
        return next(new AppError("pleaser provide the API key ", 400));
    }
    if(config.api_key !== apiKey){
        return next (new AppError("InValid API key", 400));
    };
    next(); 
});

// Mount version 1 routes
// v1(app);

// Handle unknown routes
app.use("*" , (req:Request, res:Response , next:NextFunction)=> {
    return next( new AppError("Unknown URL", 404));
})

// Global error handler
app.use(geh);

// Export the configured Express application
export default app;
