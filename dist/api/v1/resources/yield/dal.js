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
Object.defineProperty(exports, "__esModule", { value: true });
exports.YieldDal = void 0;
const model_1 = require("./model");
class YieldDal {
    // Create a new yield prediction
    static createYieldPrediction(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const prediction = yield model_1.YieldModel.create(data);
                return prediction;
            }
            catch (error) {
                throw error;
            }
        });
    }
    // Get yield prediction history for a user
    static getYieldHistory(userId, options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page, limit } = options;
                const predictions = yield model_1.YieldModel.find({ userId })
                    .sort({ predictionDate: -1 }) // Sort by newest first
                    .skip((page - 1) * limit)
                    .limit(limit);
                return predictions;
            }
            catch (error) {
                throw error;
            }
        });
    }
    // Get a yield prediction by ID
    static getYieldPrediction(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const prediction = yield model_1.YieldModel.findById(id);
                return prediction;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.YieldDal = YieldDal;
