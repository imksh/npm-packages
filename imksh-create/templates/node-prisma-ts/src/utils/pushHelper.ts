import webpush from "../config/webPush.js";
import logger from "./logger.js";
import { prisma } from "../config/db.js";

export const sendPushToUser = async (userId: string, title: string, body: string, url: string = "/") => {
  try {
    const payload = JSON.stringify({ title, body, url });
    const subs = await prisma.pushSubscription.findMany({ where: { userId } });
       for (const sub of subs) {
         const pushSub = { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } };
         await webpush.sendNotification(pushSub, payload).catch(err => {
           if (err.statusCode === 404 || err.statusCode === 410) {
             prisma.pushSubscription.delete({ where: { id: sub.id } }).catch(()=>{});
           } else {
             logger.error("Push Error", err);
           }
         });
       }
  } catch (error) {
    logger.error("Error sending push notification to user", error);
  }
};
