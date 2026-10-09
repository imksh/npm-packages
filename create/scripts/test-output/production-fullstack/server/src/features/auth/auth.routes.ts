import express from "express";
import {
  signup,
  login,
  getMe,
  logout,
  updateMe,
} from "./auth.controller.js";
import { protect } from "../../common/middlewares/auth.middleware.js";
import { apiLimiter } from "../../common/middlewares/rateLimiter.js";

const router = express.Router();

router.use(apiLimiter);

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", protect, getMe);
router.put("/me", protect, updateMe);

export default router;
