"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express"); // Import Router
const router = (0, express_1.Router)(); // Initialize router
// Import middleware functions
const middleware_1 = require("../middleware");
// Import controller functions
const controller_1 = require("./controller");
// Import role management
const shared_1 = require("../../../../shared");
// Delete session route (with multiple roles)
router.delete("/delete", middleware_1.protect, (0, middleware_1.auth)(shared_1.Role.User, shared_1.Role.Owner, shared_1.Role.SuperAdmin), controller_1.deleteSession);
// Destroy session route (for User role)
router.delete("/destroy", middleware_1.protect, (0, middleware_1.auth)(shared_1.Role.User), controller_1.destroySession);
// Get all sessions route (with admin roles)
router
    .route("/")
    .get(middleware_1.protect, (0, middleware_1.auth)(shared_1.Role.Owner, shared_1.Role.SuperAdmin, shared_1.Role.Admin), controller_1.getAllSessions);
// Get user sessions route (with User and admin roles)
router.get("/:userId/user", middleware_1.protect, (0, middleware_1.auth)(shared_1.Role.Owner, shared_1.Role.SuperAdmin, shared_1.Role.Admin, shared_1.Role.User), middleware_1.verifyUser, controller_1.getUserSessions);
// Get specific session route (with User and admin roles)
router
    .route("/:id")
    .get(middleware_1.protect, (0, middleware_1.auth)(shared_1.Role.Owner, shared_1.Role.SuperAdmin, shared_1.Role.Admin, shared_1.Role.User), controller_1.getSession);
exports.default = router; // Export router
