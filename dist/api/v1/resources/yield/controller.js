"use strict";
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
exports.getYieldPrediction = exports.getYieldHistory = exports.createYieldPrediction = void 0;
const dal_1 = require("./dal");
const app_error_1 = __importDefault(require("../../../../utils/app_error"));
// Create yield prediction handler
const createYieldPrediction = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.value;
        const userId = req.user.id; // Assuming user ID is available from protect middleware
        // Create yield prediction in database
        const prediction = yield dal_1.YieldDal.createYieldPrediction(Object.assign(Object.assign({}, data), { userId, predictionDate: new Date() }));
        // Respond with success message
        res.status(200).json({
            status: "SUCCESS",
            message: "Yield prediction created successfully.",
            data: {
                prediction,
            },
        });
    }
    catch (error) {
        next(error);
    }
});
exports.createYieldPrediction = createYieldPrediction;
// Get yield prediction history handler
const getYieldHistory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id; // Assuming user ID is available from protect middleware
        const { page = 1, limit = 10 } = req.query;
        // Fetch yield prediction history
        const history = yield dal_1.YieldDal.getYieldHistory(userId, {
            page: parseInt(page),
            limit: parseInt(limit),
        });
        // Respond with history
        res.status(200).json({
            status: "SUCCESS",
            data: {
                history,
            },
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
        // Ensure the user owns the prediction
        if (prediction.userId.toString() !== req.user.id) {
            return next(new app_error_1.default("Unauthorized access to prediction.", 403));
        }
        res.status(200).json({
            status: "SUCCESS",
            data: {
                prediction,
            },
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getYieldPrediction = getYieldPrediction;
