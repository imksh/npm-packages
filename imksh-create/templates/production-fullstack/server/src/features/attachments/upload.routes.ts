import express from "express";
import { upload } from "../../common/middlewares/multer.js";
import { uploadFile } from "./upload.controller.js";
import { protect } from "../../common/middlewares/auth.middleware.js";
import { uploadLimiter } from "../../common/middlewares/rateLimiter.js";

const router = express.Router();

router.post("/", protect, uploadLimiter, upload.single("file"), uploadFile);

export default router;
