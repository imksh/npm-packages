import PushSubscription from "../models/pushSubscription.model.js";
import logger from "../utils/logger.js";

export const subscribe = async (req, res, next) => {
  try {
    const subscription = req.body;
    const userId = req.user?._id || req.user?.id; // supports both mongoose and prisma IDs
    
    if (!subscription || !subscription.endpoint) {
      return next({ status: 400, message: "Invalid subscription payload" });
    }

    const existingSub = await PushSubscription.findOne({ endpoint: subscription.endpoint });

    if (existingSub) {
      if (userId) {
        existingSub.user = userId; await existingSub.save();
      }
      return res.status(200).json({ success: true, message: "Already subscribed." });
    }

    
    await PushSubscription.create({
      endpoint: subscription.endpoint,
      keys: subscription.keys,
      user: userId || undefined
    });
    

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

    await PushSubscription.deleteOne({ endpoint });

    res.status(200).json({ success: true, message: "Unsubscribed." });
  } catch (error) {
    logger.error("Error in push unsubscribe controller", error);
    next(error);
  }
};
