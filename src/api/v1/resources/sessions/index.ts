import { Router } from "express";
import { protect } from "../middleware/protect";
import { auth } from "../middleware";
import { Role } from "../../../../shared";
import { getAllSessions } from "./controller";

const router = Router();





router.delete(
    "/delete",
    protect,
    auth(Role.User, Role.OWner, Role.SuperAdmin),
);
router.delete("/destroy", protect, auth(Role.User), );
router.get("/:userId/usr", protect, auth(Role.OWner, Role.SuperAdmin, Role.Admin), getAllSessions);
router.route("/:id").get(protect, auth(Role.OWner, Role.SuperAdmin, Role.Admin, Role.User), getAllSessions)
export default router;