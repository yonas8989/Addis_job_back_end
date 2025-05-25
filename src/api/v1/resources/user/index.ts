import { Router } from "express";
const router = Router();

import { validator, protect, auth, verifyUser } from "../middleware";
import { createUserValidation, userLoginValidation } from "./validations";
import { createUser, userLogin, getUser } from "./controller";
import { Role } from "../../../../shared";

// User authentication routes
router.post("/login", validator(userLoginValidation), userLogin);
router.post("/", validator(createUserValidation), createUser);

// Protected user routes
router.get("/:userId", protect, auth(Role.User), verifyUser, getUser);

export default router;