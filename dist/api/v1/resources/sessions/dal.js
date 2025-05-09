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
exports.SessionsDal = void 0;
const model_1 = require("./model"); // Mongoose model for sessions
const apiFeatures_1 = require("../../../../utils/apiFeatures"); // Utility class for filtering, sorting, and pagination
class SessionsDal {
    // Create a new session
    static createSession(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const session = yield model_1.SessionsModel.create({
                    user: data.userId,
                    deviceId: data.deviceId,
                    deviceInfo: data.deviceInfo,
                    expireDate: data.expireDate,
                    isOwner: data.isOwner,
                });
                return session;
            }
            catch (error) {
                throw error;
            }
        });
    }
    // Get all sessions with optional filtering and pagination
    static getAllSessions(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const apiFeatures = new apiFeatures_1.APIFeatures(model_1.SessionsModel.find(), query)
                    .filter() // Apply filtering
                    .sort() // Apply sorting
                    .project() // Select specific fields
                    .paginate(); // Apply pagination
                const sessions = yield apiFeatures.dbQuery; // Execute the query
                const totalResults = yield model_1.SessionsModel.countDocuments(); // Count total documents
                return { sessions, totalResults };
            }
            catch (error) {
                throw error;
            }
        });
    }
    // Get all sessions for a specific user
    static getUserSessions(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sessions = yield model_1.SessionsModel.find({ user: userId });
                return sessions;
            }
            catch (error) {
                throw error;
            }
        });
    }
    // Get a session by its ID
    static getSession(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const session = yield model_1.SessionsModel.findById(id);
                return session;
            }
            catch (error) {
                throw error;
            }
        });
    }
    // Get a session by user ID and device ID
    static getSessionByUserAndDeviceId(userId, deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const session = yield model_1.SessionsModel.findOne({ user: userId, deviceId });
                return session;
            }
            catch (error) {
                throw error;
            }
        });
    }
    // Destroy a session based on user ID and device ID
    static destroySession(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const session = yield model_1.SessionsModel.findOneAndDelete({
                    user: data.userId,
                    deviceId: data.deviceId,
                });
                return session;
            }
            catch (error) {
                throw error;
            }
        });
    }
    // Delete a session by its ID
    static deleteSession(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const session = yield model_1.SessionsModel.findByIdAndDelete(id);
                return session;
            }
            catch (error) {
                throw error;
            }
        });
    }
    // Update the expiration date of a session
    static updateSessionExpireDate(id, expireDate) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const session = yield model_1.SessionsModel.findByIdAndUpdate(id, { expireDate }, { runValidators: true, new: true });
                return session;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.SessionsDal = SessionsDal;
