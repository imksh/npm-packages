import webpush from "../config/webPush.js";
import logger from "./logger.js";
import PushSubscription from "../models/pushSubscription.model.js";

export const sendPushToUser = async (userId, title, body, url = "/") => {
  try {
    const payload = JSON.stringify({ title, body, url });
    const subs = await PushSubscription.find({ user: userId });
       for (const sub of subs) {
         await webpush.sendNotification({ endpoint: sub.endpoint, keys: sub.keys }, payload).catch(err => {
           if (err.statusCode === 404 || err.statusCode === 410) {
             sub.deleteOne();
           } else {
             logger.error("Push Error", err);
           }
         });
       }
  } catch (error) {
    logger.error("Error sending push notification to user", error);
  }
};
