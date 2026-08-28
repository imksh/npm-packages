import { Request, Response, NextFunction } from "express";
import PushSubscription from "../models/pushSubscription.model.js";
import logger from "../utils/logger.js";

export const subscribe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const subscription = req.body;
    const userId = req.user?._id || req.user?.id; // supports both mongoose and prisma IDs
    
    if (!subscription) {
      return next({ status: 400, message: "Invalid subscription payload" });
    }

    const isExpo = !!subscription.token;
    const isWeb = !!(subscription.endpoint && subscription.keys);

    if (!isExpo && !isWeb) {
      return next({ status: 400, message: "Missing token (EXPO) or endpoint/keys (WEB)" });
    }

    if (isExpo) {
      const existingSub = await PushSubscription.findOne({ expoPushToken: subscription.token });
      if (existingSub) {
        if (userId && String(existingSub.user) !== String(userId)) {
          existingSub.user = userId; await existingSub.save();
        }
        return res.status(200).json({ success: true, message: "Already subscribed." });
      }

      await PushSubscription.create({
        type: "EXPO",
        expoPushToken: subscription.token,
        user: userId || undefined
      });
    } else {
      const existingSub = await PushSubscription.findOne({ endpoint: subscription.endpoint });
      if (existingSub) {
        if (userId && String(existingSub.user) !== String(userId)) {
          existingSub.user = userId; await existingSub.save();
        }
        return res.status(200).json({ success: true, message: "Already subscribed." });
      }

      await PushSubscription.create({
        type: "WEB",
        endpoint: subscription.endpoint,
        keys: subscription.keys,
        user: userId || undefined
      });
    }

    res.status(201).json({ success: true, message: "Subscription created." });
  } catch (error) {
    logger.error("Error in push subscribe controller", error);
    next(error);
  }
};

export const unsubscribe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { endpoint } = req.body;
    if (!endpoint) {
      return next({ status: 400, message: "Endpoint required" });
    }

    await PushSubscription.deleteOne({ endpoint });

    res.status(200).json({ success: true, message: "Unsubscribed." });
  } catch (error) {
    logger.error("Error in push unsubscribe controller", error);
    next(error);
  }
};
