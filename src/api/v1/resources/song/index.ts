import { Router } from "express";
const router = Router();

import { validator, protect, auth } from "../middleware";
import { createSongValidation, updateSongValidation } from "./validation";
import {
  createSong,
  getSong,
  getAllSongs,
  updateSong,
  deleteSong,
  getUserSongs,
  getSongStatistics,
} from "./controller";
import { Role } from "../../../../shared";

// Apply protect middleware to all song routes
router.use(protect);

// Public routes (no auth required)
router.get("/", getAllSongs);
// Statistics route should come before parameterized routes
router.get("/stats", getSongStatistics);
// Parameterized routes come after specific routes
router.get("/:songId", getSong);

// User routes
router.post("/", auth(Role.User), validator(createSongValidation), createSong);
router.patch("/:songId", auth(Role.User), validator(updateSongValidation), updateSong);
router.delete("/:songId", auth(Role.User), deleteSong);
router.get("/user/:userId", getUserSongs);

export default router;