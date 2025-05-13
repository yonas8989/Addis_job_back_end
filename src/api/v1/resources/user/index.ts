import { Router } from "express";
const router = Router();

// Import middleware functions
import { validator, protect, auth, verifyUser } from "../middleware";

// Import validation schemas
import {
  createUserValidation,
  userLoginValidation,
  verifyOtpValidation,
  updateProfileValidation,
  profilePictureValidation,
} from "./validations";

// Import controller functions
import {
  createUser,
  userLogin,
  verifyOtp,
  requestOtp,
  getUser,
  getProfile,
  updateProfile,
  uploadProfilePicture,
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

// Profile routes
router
  .route("/profile")
  .get(protect, auth(Role.User), getProfile )
  .put(protect, auth(Role.User), validator(updateProfileValidation), updateProfile);

// Profile picture upload route
router.post(
  "/profile-picture",
  protect,
  auth(Role.User),
  validator(profilePictureValidation),
  uploadProfilePicture
);

export default router;