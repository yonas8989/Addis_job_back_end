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
    cropType: {
        type: String,
        required: [true, "Crop type is required."],
        maxlength: [50, "Crop type cannot exceed 50 characters."],
    },
    fieldSize: {
        type: Number,
        required: [true, "Field size is required."],
        min: [0.1, "Field size must be at least 0.1 hectares."],
    },
    soilType: {
        type: String,
        required: [true, "Soil type is required."],
        maxlength: [50, "Soil type cannot exceed 50 characters."],
    },
    weatherConditions: {
        temperatureMax: {
            type: Number,
            required: [true, "Maximum temperature is required."],
        },
        temperatureMin: {
            type: Number,
            required: [true, "Minimum temperature is required."],
        },
        humidity: {
            type: Number,
            required: [true, "Humidity is required."],
            min: [0, "Humidity cannot be negative."],
            max: [100, "Humidity cannot exceed 100%."],
        },
        windSpeed: {
            type: Number,
            required: [true, "Wind speed is required."],
            min: [0, "Wind speed cannot be negative."],
        },
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
