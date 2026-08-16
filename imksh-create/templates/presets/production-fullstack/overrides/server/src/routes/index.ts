import express from "express";
import authRoutes from "../features/auth/auth.routes.js";
import uploadRoutes from "../features/attachments/upload.routes.js";
import pushRoutes from "../features/notifications/push.routes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/upload", uploadRoutes);
router.use("/push", pushRoutes);

export default router;
