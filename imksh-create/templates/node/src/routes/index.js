import express from "express";
import authRoutes from "./auth.route.js";
import uploadRoutes from "./upload.route.js";
import pushRoutes from "./push.route.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/upload", uploadRoutes);
router.use("/push", pushRoutes);

export default router;
