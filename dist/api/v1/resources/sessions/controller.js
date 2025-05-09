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
exports.deleteSession = exports.destroySession = exports.getSession = exports.getUserSessions = exports.getAllSessions = void 0;
const app_error_1 = __importDefault(require("../../../../utils/app_error"));
const dal_1 = require("./dal");
/**
 * Controller: Get all sessions (admin level).
 * Supports filtering/pagination via query parameters.
 */
const getAllSessions = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sessions, totalResults } = yield dal_1.SessionsDal.getAllSessions(req.query);
        res.status(200).json({
            status: "SUCCESS",
            results: sessions.length,
            totalResults,
            data: { sessions },
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getAllSessions = getAllSessions;
/**
 * Controller: Get all sessions for a specific user.
 * Expects `userId` in the route parameter.
 */
const getUserSessions = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sessions = yield dal_1.SessionsDal.getUserSessions(req.params.userId);
        res.status(200).json({
            status: "SUCCESS",
            results: sessions.length,
            data: { sessions },
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getUserSessions = getUserSessions;
/**
 * Controller: Get a single session by its ID.
 * If the session is not found, returns 404.
 */
const getSession = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const session = yield dal_1.SessionsDal.getSession(req.params.id);
        if (!session)
            return next(new app_error_1.default("Session does not exists.", 404));
        res.status(200).json({
            status: "SUCCESS",
            data: { session },
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getSession = getSession;
/**
 * Controller: Destroy a session (used during logout).
 * Expects `userId` and `deviceId` in query parameters.
 * - If the session is the owner session, ensures no other sessions exist before destroying.
 */
const destroySession = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.query.userId;
        const deviceId = req.query.deviceId;
        if (!userId || !deviceId) {
            return next(new app_error_1.default("User ID and Device ID are required.", 400));
        }
        const sessionData = yield dal_1.SessionsDal.getSessionByUserAndDeviceId(userId, deviceId);
        if (!sessionData)
            return next(new app_error_1.default("Session does not exists.", 404));
        // If this is the owner session, make sure there are no other sessions
        if (sessionData.isOwner) {
            const userSessions = yield dal_1.SessionsDal.getUserSessions(sessionData.user);
            if (userSessions.length > 1) {
                return next(new app_error_1.default("First remove the other sessions before logging out.", 400));
            }
        }
        const session = yield dal_1.SessionsDal.destroySession({ userId, deviceId });
        if (!session)
            return next(new app_error_1.default("User session does not exists.", 404));
        res.status(200).json({
            status: "SUCCESS",
            message: "Session is successfully destroyed.",
        });
    }
    catch (error) {
        next(error);
    }
});
exports.destroySession = destroySession;
/**
 * Controller: Delete a specific session (admin or session owner).
 * Requires:
 * - `ownerId`, `ownerDeviceId` (to validate ownership)
 * - `sessionId` (the target session to delete)
 *
 * Prevents deletion of the owner session if other sessions exist.
 */
const deleteSession = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ownerId = req.query.ownerId;
        const ownerDeviceId = req.query.ownerDeviceId;
        const sessionId = req.query.sessionId;
        if (!ownerId || !ownerDeviceId || !sessionId) {
            return next(new app_error_1.default("Owner ID, Owner Device ID and Session ID are required.", 400));
        }
        // Validate ownership of the session
        const ownerSessionData = yield dal_1.SessionsDal.getSessionByUserAndDeviceId(ownerId, ownerDeviceId);
        if (!ownerSessionData)
            return next(new app_error_1.default("User session does not exists.", 404));
        if (!ownerSessionData.isOwner) {
            return next(new app_error_1.default("You are not authorized to destroy sessions.", 403));
        }
        const sessionData = yield dal_1.SessionsDal.getSession(sessionId);
        if (!sessionData)
            return next(new app_error_1.default("Session does not exists.", 404));
        // Prevent deletion of owner session if other sessions still exist
        if (sessionData.isOwner) {
            const userSessions = yield dal_1.SessionsDal.getUserSessions(sessionData.user);
            if (userSessions.length > 1) {
                return next(new app_error_1.default("First remove the other sessions before deleting the parent session.", 400));
            }
        }
        const session = yield dal_1.SessionsDal.deleteSession(sessionId);
        if (!session)
            return next(new app_error_1.default("Session does not exists.", 404));
        res.status(200).json({
            status: "SUCCESS",
            message: "Session is successfully deleted.",
        });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteSession = deleteSession;
