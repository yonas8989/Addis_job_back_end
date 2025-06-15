"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getYieldPrediction = exports.getYieldHistory = exports.uploadYieldData = exports.createYieldPrediction = void 0;
const dal_1 = require("./dal");
const app_error_1 = __importDefault(require("../../../../utils/app_error"));
const yieldService_1 = require("../../../../utils/yieldService");
const csv_parse_1 = require("csv-parse");
const XLSX = __importStar(require("xlsx"));
const validation_1 = require("./validation");
// Create yield prediction handler
const createYieldPrediction = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.value;
        if (!req.user) {
            return next(new app_error_1.default("User not authenticated.", 401));
        }
        const userId = req.user.id;
        // Call Flask API to get predicted yield
        const predictedYield = yield (0, yieldService_1.predictYield)({
            NAME: data.name,
            ELEVATION: data.elevation,
            Year: data.year,
            PRECIP: data.precipitation,
            RELHUM: data.relativeHumidity,
            SUNHRS: data.sunshineHours,
            TMPMIN: data.temperatureMin,
            TMPMAX: data.temperatureMax,
            WINDLY: data.windSpeed,
        });
        // Create yield prediction in database
        const prediction = yield dal_1.YieldDal.createYieldPrediction(Object.assign(Object.assign({}, data), { userId,
            predictedYield, predictionDate: new Date() }));
        // Respond with success message
        res.status(200).json({
            status: "SUCCESS",
            message: "Yield prediction created successfully.",
            data: { prediction },
        });
    }
    catch (error) {
        next(error);
    }
});
exports.createYieldPrediction = createYieldPrediction;
// File upload handler
const uploadYieldData = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return next(new app_error_1.default("User not authenticated.", 401));
        }
        const userId = req.user.id;
        if (!req.file) {
            return next(new app_error_1.default("No file uploaded.", 400));
        }
        const file = req.file;
        const fileType = file.mimetype;
        let records = [];
        // Parse CSV file
        if (fileType === "text/csv") {
            records = yield new Promise((resolve, reject) => {
                const results = [];
                (0, csv_parse_1.parse)(file.buffer.toString(), { columns: true, skip_empty_lines: true })
                    .on("data", (row) => {
                    results.push({
                        name: row.name,
                        elevation: Number(row.elevation),
                        year: Number(row.year),
                        precipitation: Number(row.precipitation),
                        relativeHumidity: Number(row.relativeHumidity),
                        sunshineHours: Number(row.sunshineHours),
                        temperatureMin: Number(row.temperatureMin),
                        temperatureMax: Number(row.temperatureMax),
                        windSpeed: Number(row.windSpeed),
                    });
                })
                    .on("end", () => resolve(results))
                    .on("error", (error) => reject(error));
            });
        }
        // Parse Excel file
        else if (fileType === "application/vnd.ms-excel" ||
            fileType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
            const workbook = XLSX.read(file.buffer, { type: "buffer" });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            records = XLSX.utils.sheet_to_json(sheet).map((row) => ({
                name: row.name,
                elevation: Number(row.elevation),
                year: Number(row.year),
                precipitation: Number(row.precipitation),
                relativeHumidity: Number(row.relativeHumidity),
                sunshineHours: Number(row.sunshineHours),
                temperatureMin: Number(row.temperatureMin),
                temperatureMax: Number(row.temperatureMax),
                windSpeed: Number(row.windSpeed),
            }));
        }
        else {
            return next(new app_error_1.default("Invalid file type. Please upload a CSV or Excel file.", 400));
        }
        // Validate and process each record
        const predictions = [];
        for (const data of records) {
            // Validate data using Joi schema
            const { error } = validation_1.yieldPredictionValidation.validate(data);
            if (error) {
                return next(new app_error_1.default(`Validation error: ${error.message}`, 400));
            }
            // Create yield prediction in database without calling ML API
            const prediction = yield dal_1.YieldDal.createYieldPrediction(Object.assign(Object.assign({}, data), { userId, predictedYield: undefined, predictionDate: new Date() }));
            predictions.push(prediction);
        }
        // Respond with success message
        res.status(200).json({
            status: "SUCCESS",
            message: `Successfully stored ${predictions.length} yield records.`,
            data: { predictions },
        });
    }
    catch (error) {
        next(error);
    }
});
exports.uploadYieldData = uploadYieldData;
// Get yield prediction history handler
const getYieldHistory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return next(new app_error_1.default("User not authenticated.", 401));
        }
        const userId = req.user.id;
        const { page = 1, limit = 10 } = req.query;
        // Fetch yield prediction history
        const history = yield dal_1.YieldDal.getYieldHistory(userId, {
            page: parseInt(page),
            limit: parseInt(limit),
        });
        // Respond with history
        res.status(200).json({
            status: "SUCCESS",
            data: { history },
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getYieldHistory = getYieldHistory;
// Get single yield prediction handler
const getYieldPrediction = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const prediction = yield dal_1.YieldDal.getYieldPrediction(req.params.id);
        if (!prediction)
            return next(new app_error_1.default("Yield prediction not found.", 404));
        if (!req.user) {
            return next(new app_error_1.default("User not authenticated.", 401));
        }
        // Ensure the user owns the prediction
        if (prediction.userId.toString() !== req.user.id) {
            return next(new app_error_1.default("Unauthorized access to prediction.", 403));
        }
        res.status(200).json({
            status: "SUCCESS",
            data: { prediction },
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getYieldPrediction = getYieldPrediction;
