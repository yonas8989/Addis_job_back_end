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
exports.getUser = exports.requestOtp = exports.userLogin = exports.verifyOtp = exports.createUser = void 0;
const hashPayload_1 = require("../../../../utils/hashPayload");
const generateOtp_1 = require("../../../../utils/generateOtp");
const dal_1 = require("./dal");
const bcryptjs_1 = require("bcryptjs");
const app_error_1 = __importDefault(require("../../../../utils/app_error"));
const token_1 = require("../../../../utils/token");
const dal_2 = require("../sessions/dal");
const deviceInfo_1 = require("../../../../utils/deviceInfo");
const deviceIdGenerator_1 = require("../../../../utils/deviceIdGenerator");
// Create user handler
const createUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.value;
        // Hash the password
        const password = (0, hashPayload_1.hashPayload)(data.password);
        // Generate and hash OTP
        const otp = (0, generateOtp_1.generateOtp)();
        const hashedOtp = (0, hashPayload_1.hashPayload)(otp);
        const otpExpiresIn = new Date(Date.now() + 1 * 60 * 1000); // 1 minute expiry
        // Create user in database
        const user = yield dal_1.UserDal.createUser({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phoneNumber: data.phoneNumber,
            password,
            otp: hashedOtp,
            otpExpiresIn,
        });
        // Log OTP (should be sent via SMS/Email in real app)
        console.log(otp);
        // Respond with success message
        res.status(200).json({
            status: "SUCCESS",
            message: "User account is successfully created. Please verify your account using the OTP sent to your email or phone number.",
            data: {
                user,
            },
        });
    }
    catch (error) {
        next(error);
    }
});
exports.createUser = createUser;
// OTP verification handler
const verifyOtp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.value;
        // Retrieve user
        const userData = yield dal_1.UserDal.getUser(req.params.userId);
        if (!userData)
            return next(new app_error_1.default("User does not exists.", 404));
        // Check if OTP exists
        if (!userData.otp || !userData.otpExpiresIn)
            return next(new app_error_1.default("OTP can not be found. Please request again.", 400));
        // Validate OTP
        if (!(0, bcryptjs_1.compareSync)(data.otp, userData.otp))
            return next(new app_error_1.default("Invalid OTP.", 400));
        // Check OTP expiration
        const otpExpiresIn = userData.otpExpiresIn.getTime();
        const currentDate = new Date().getTime();
        if (otpExpiresIn < currentDate)
            return next(new app_error_1.default("OTP has expired. Please request again.", 400));
        // Mark user as verified
        const user = yield dal_1.UserDal.verifyUser(userData.id);
        if (!user)
            return next(new app_error_1.default("User does not exists.", 404));
        // Send success response
        res.status(200).json({
            status: "SUCCESS",
            message: "You have successfully verified your account.",
            data: {
                user,
            },
        });
    }
    catch (error) {
        next(error);
    }
});
exports.verifyOtp = verifyOtp;
// User login handler
const userLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Login attempt with data:', req.value);
        const data = req.value;
        // Get user by email or phone
        const user = yield dal_1.UserDal.getUserByEmailOrPhoneNumber(data.emailOrPhoneNumber);
        console.log('User found:', user ? 'Yes' : 'No');
        // Check credentials
        if (!user || !(0, bcryptjs_1.compareSync)(data.password, user.password)) {
            console.log('Login failed: Invalid credentials');
            return next(new app_error_1.default("Invalid Login Credentials.", 400));
        }
        // Reset flags if changed
        if (user.isEmailOrPhoneNumberChanged) {
            yield dal_1.UserDal.updateIsEmailOrPhoneNumberChanged(user.id, false);
        }
        if (user.isPasswordChanged) {
            yield dal_1.UserDal.updateIsPasswordChanged(user.id, false);
        }
        // Limit to 3 sessions per user
        const userSessions = yield dal_2.SessionsDal.getUserSessions(user.id);
        if (userSessions.length >= 3)
            return next(new app_error_1.default("Maximum number of sessions for this user has reached.", 400));
        // Determine if session is the owner's first
        let isOwner = false;
        if (userSessions.length === 0) {
            isOwner = true;
        }
        // Get user-agent string
        let userAgent = "Unknown";
        if (req.headers["user-agent"]) {
            userAgent = req.headers["user-agent"];
        }
        // Generate device ID and create session
        let deviceId = (0, deviceIdGenerator_1.deviceIdGenerator)(user.id);
        const session = yield dal_2.SessionsDal.createSession({
            userId: user.id,
            deviceId,
            deviceInfo: (0, deviceInfo_1.deviceInfo)(userAgent),
            expireDate: new Date(Date.now() + 20 * 60 * 1000), // 20 minutes
            isOwner,
        });
        // Generate access token
        const token = (0, token_1.generateToken)(user.id, "user", deviceId);
        // Respond with token, user, and session
        res.status(200).json({
            status: "SUCCESS",
            data: {
                user,
            },
            token,
            session,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.userLogin = userLogin;
// Request new OTP handler
const requestOtp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get user by ID
        const userData = yield dal_1.UserDal.getUser(req.params.userId);
        if (!userData)
            return next(new app_error_1.default("User does not exists.", 404));
        // Reject if user is already verified
        if (userData.isVerified)
            return next(new app_error_1.default("You account is already verified.", 400));
        // Generate new OTP
        const otp = (0, generateOtp_1.generateOtp)();
        const hashedOtp = (0, hashPayload_1.hashPayload)(otp);
        const otpExpiresIn = new Date(Date.now() + 1 * 60 * 1000); // 1 minute
        // Update OTP in DB
        const user = yield dal_1.UserDal.updateOtp(req.params.userId, hashedOtp, otpExpiresIn);
        if (!user)
            return next(new app_error_1.default("User does not exists.", 404));
        // Log OTP (should be sent via SMS/Email in real app)
        console.log(otp);
        // Send response
        res.status(200).json({
            status: "SUCCESS",
            message: "You have recieved an OTP via SMS or Email.",
        });
    }
    catch (error) {
        next(error);
    }
});
exports.requestOtp = requestOtp;
// Get single user info
const getUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield dal_1.UserDal.getUser(req.params.userId);
        if (!user)
            return next(new app_error_1.default("User does not exists.", 404));
        res.status(200).json({
            status: "SUCCESS",
            data: {
                user,
            },
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getUser = getUser;
