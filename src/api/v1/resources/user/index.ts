import { Router } from "express";
const router = Router();


import { auth, validator } from "../middleware";
import { createUserValidation, userLoginValidation,verifyOtpValidation } from "./validations";
import { createUser, userLogin } from "./controller";
import { Role } from "../../../../shared";


router.post("/login", validator(userLoginValidation), userLogin);
router.route("/").post(validator(createUserValidation), createUser);



export default router;