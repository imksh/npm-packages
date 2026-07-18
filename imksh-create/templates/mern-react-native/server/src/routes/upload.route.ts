import express from "express";
import { upload } from "../middleware/multer.js";
import { uploadFile } from "../controllers/upload.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { uploadLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.post("/", protect, uploadLimiter, upload.single("file"), uploadFile);

export default router;
