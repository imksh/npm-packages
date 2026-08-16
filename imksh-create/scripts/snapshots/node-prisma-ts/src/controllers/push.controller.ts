import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/db.js";
import logger from "../utils/logger.js";

export const subscribe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const subscription = req.body;
    const userId = req.user?._id || req.user?.id; // supports both mongoose and prisma IDs
    
    if (!subscription || !subscription.endpoint) {
      return next({ status: 400, message: "Invalid subscription payload" });
    }

    const existingSub = await prisma.pushSubscription.findUnique({ where: { endpoint: subscription.endpoint } });

    if (existingSub) {
      if (userId) {
        await prisma.pushSubscription.update({ where: { endpoint: subscription.endpoint }, data: { userId } })
      }
      return res.status(200).json({ success: true, message: "Already subscribed." });
    }

    
    await prisma.pushSubscription.create({
      data: {
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
        userId: userId || null
      }
    });
    

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

    await prisma.pushSubscription.delete({ where: { endpoint } }).catch(() => {})

    res.status(200).json({ success: true, message: "Unsubscribed." });
  } catch (error) {
    logger.error("Error in push unsubscribe controller", error);
    next(error);
  }
};
