import express from "express";
import { subscribe, unsubscribe } from "../controllers/push.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// You can remove protect if you want anonymous users to be able to subscribe
router.post("/subscribe", protect, subscribe);
router.post("/unsubscribe", unsubscribe);

export default router;
