import express from "express";
import {
  signup,
  login,
  getMe,
  logout,
  updateMe,
} from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { apiLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.use(apiLimiter);

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", protect, getMe);
router.put("/me", protect, updateMe);

export default router;
