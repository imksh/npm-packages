import express from "express";
import authRoutes from "./auth.route.js";
import uploadRoutes from "./upload.route.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/upload", uploadRoutes);

export default router;
