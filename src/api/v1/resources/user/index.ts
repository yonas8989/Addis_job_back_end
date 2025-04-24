import { Router } from "express"; // Import Router
const router = Router(); // Initialize router

// Import middleware functions
import { validator, protect, auth, verifyUser } from "../middleware";

// Import validation schemas
import {
  createUserValidation,
  userLoginValidation,
  verifyOtpValidation,
} from "./validations";

// Import controller functions
import {
  createUser,
  userLogin,
  verifyOtp,
  requestOtp,
  getUser,
} from "./controller";

// Import role management
import { Role } from "../../../../shared";

// User login route
router.post("/login", validator(userLoginValidation), userLogin);

// Create user route
router.route("/").post(validator(createUserValidation), createUser);

// OTP verification route
router.patch("/:userId/verifyotp", validator(verifyOtpValidation), verifyOtp);

// Request OTP route (with authentication and role check)
router.patch(
  "/:userId/requestotp",
  protect,
  auth(Role.User),
  verifyUser,
  requestOtp
);

// Get user route (with authentication and role check)
router.route("/:userId").get(protect, auth(Role.User), verifyUser, getUser);

export default router; // Export router
