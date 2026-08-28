import { prisma } from "../config/db.js";
import logger from "../utils/logger.js";

export const subscribe = async (
  req,
  res,
  next,
) => {
  try {
    const subscription = req.body;
    const userId = req.user?._id || req.user?.id;

    if (!subscription) {
      return next({ status: 400, message: "Invalid subscription payload" });
    }

    // Determine type: EXPO if token is present, else WEB
    const isExpo = !!subscription.token;
    const isWeb = !!(subscription.endpoint && subscription.keys);

    if (!isExpo && !isWeb) {
      return next({ status: 400, message: "Missing token (EXPO) or endpoint/keys (WEB)" });
    }

    if (isExpo) {
      const existingSub = await prisma.pushSubscription.findUnique({
        where: { token: subscription.token },
      });

      if (existingSub) {
        if (userId && existingSub.userId !== userId) {
          await prisma.pushSubscription.update({
            where: { token: subscription.token },
            data: { userId },
          });
        }
        return res.status(200).json({ success: true, message: "Already subscribed." });
      }

      await prisma.pushSubscription.create({
        data: {
          type: "EXPO",
          token: subscription.token,
          userId: userId || null,
        },
      });
    } else {
      const existingSub = await prisma.pushSubscription.findUnique({
        where: { endpoint: subscription.endpoint },
      });

      if (existingSub) {
        if (userId && existingSub.userId !== userId) {
          await prisma.pushSubscription.update({
            where: { endpoint: subscription.endpoint },
            data: { userId },
          });
        }
        return res.status(200).json({ success: true, message: "Already subscribed." });
      }

      await prisma.pushSubscription.create({
        data: {
          type: "WEB",
          endpoint: subscription.endpoint,
          keys: subscription.keys,
          userId: userId || null,
        },
      });
    }

    res.status(201).json({ success: true, message: "Subscription created." });
  } catch (error) {
    logger.error("Error in push subscribe controller", error);
    next(error);
  }
};

export const unsubscribe = async (req, res, next) => {
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
