import { Router } from "express"; // Import Router
const router = Router(); // Initialize router

// Import middleware functions
import { protect, auth, validator, verifyUser } from "../middleware";

// Import validation schema
import { destroySessionValidation } from "./validations";

// Import controller functions
import {
  getAllSessions,
  getUserSessions,
  getSession,
  destroySession,
  deleteSession,
} from "./controller";

// Import role management
import { Role } from "../../../../shared";

// Delete session route (with multiple roles)
router.delete(
  "/delete",
  protect,
  auth(Role.User, Role.Owner, Role.SuperAdmin),
  deleteSession
);

// Destroy session route (for User role)
router.delete("/destroy", protect, auth(Role.User), destroySession);

// Get all sessions route (with admin roles)
router
  .route("/")
  .get(protect, auth(Role.Owner, Role.SuperAdmin, Role.Admin), getAllSessions);

// Get user sessions route (with User and admin roles)
router.get(
  "/:userId/user",
  protect,
  auth(Role.Owner, Role.SuperAdmin, Role.Admin, Role.User),
  verifyUser,
  getUserSessions
);

// Get specific session route (with User and admin roles)
router
  .route("/:id")
  .get(
    protect,
    auth(Role.Owner, Role.SuperAdmin, Role.Admin, Role.User),
    getSession
  );

export default router; // Export router
