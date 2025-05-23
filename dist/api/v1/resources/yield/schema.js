"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.yieldSchema = void 0;
const mongoose_1 = require("mongoose");
exports.yieldSchema = new mongoose_1.Schema({
    userId: {
        type: String,
        required: [true, "User ID is required."],
        index: true,
    },
    name: {
        type: String,
        required: [true, "Location name is required."],
        maxlength: [100, "Location name cannot exceed 100 characters."],
    },
    elevation: {
        type: Number,
        required: [true, " elevation is required."],
        min: [0, " elevation cannot be negative."],
    },
    year: {
        type: Number,
        required: [true, "Year is required."],
        min: [1900, "Year must be at least 1900."],
    },
    precipitation: {
        type: Number,
        required: [true, "Precipitation is required."],
        min: [0, "Precipitation cannot be negative."],
    },
    relativeHumidity: {
        type: Number,
        required: [true, "Relative humidity is required."],
        min: [0, "Relative humidity cannot be negative."],
        max: [100, "Relative humidity cannot exceed 100%."],
    },
    sunshineHours: {
        type: Number,
        required: [true, "Sunshine hours are required."],
        min: [0, "Sunshine hours cannot be negative."],
    },
    temperatureMin: {
        type: Number,
        required: [true, "Minimum temperature is required."],
    },
    temperatureMax: {
        type: Number,
        required: [true, "Maximum temperature is required."],
    },
    windSpeed: {
        type: Number,
        required: [true, "Wind speed is required."],
        min: [0, "Wind speed cannot be negative."],
    },
    predictedYield: {
        type: Number,
        required: [true, "Predicted yield is required."],
        min: [0, "Predicted yield cannot be negative."],
    },
    predictionDate: {
        type: Date,
        required: [true, "Prediction date is required."],
    },
}, {
    writeConcern: {
        w: "majority",
        j: true,
    },
    timestamps: true,
});
