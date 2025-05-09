"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express"); // Import Router
const router = (0, express_1.Router)(); // Initialize router
// Import middleware functions
const middleware_1 = require("../middleware");
// Import validation schemas
const validations_1 = require("./validations");
// Import controller functions
const controller_1 = require("./controller");
// Import role management
const shared_1 = require("../../../../shared");
// User login route
router.post("/login", (0, middleware_1.validator)(validations_1.userLoginValidation), controller_1.userLogin);
// Create user route
router.route("/").post((0, middleware_1.validator)(validations_1.createUserValidation), controller_1.createUser);
// OTP verification route
router.patch("/:userId/verifyotp", (0, middleware_1.validator)(validations_1.verifyOtpValidation), controller_1.verifyOtp);
// Request OTP route (with authentication and role check)
router.patch("/:userId/requestotp", middleware_1.protect, (0, middleware_1.auth)(shared_1.Role.User), middleware_1.verifyUser, controller_1.requestOtp);
// Get user route (with authentication and role check)
router.route("/:userId").get(middleware_1.protect, (0, middleware_1.auth)(shared_1.Role.User), middleware_1.verifyUser, controller_1.getUser);
exports.default = router; // Export router
