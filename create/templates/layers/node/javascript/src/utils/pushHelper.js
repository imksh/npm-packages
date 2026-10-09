import webpush from "../config/webPush.js";
import { Expo } from "expo-server-sdk";
import logger from "./logger.js";
import PushSubscription from "../models/pushSubscription.model.js";

const expo = new Expo();

export const sendPushToUser = async (
  userId,
  title,
  body,
  url = "/",
) => {
  try {
    const subscriptions = await PushSubscription.find({ user: userId });

    if (subscriptions.length === 0) return;

    const webSubs = subscriptions.filter(s => s.type === "WEB");
    const expoSubs = subscriptions.filter(s => s.type === "EXPO");

    // Web Push
    if (webSubs.length > 0) {
      const payload = JSON.stringify({ title, body, url });
      await Promise.allSettled(
        webSubs.map(async (sub) => {
          if (!sub.endpoint || !sub.keys) return;
          const pushSub = { endpoint: sub.endpoint, keys: sub.keys };
          try {
            await webpush.sendNotification(pushSub, payload);
          } catch (err) {
            if (err.statusCode === 404 || err.statusCode === 410) {
              await sub.deleteOne();
            } else {
              logger.error("Web Push Error", err);
            }
          }
        })
      );
    }

    // Expo Push
    if (expoSubs.length > 0) {
      const messages = [];
      for (const sub of expoSubs) {
        if (!sub.expoPushToken || !Expo.isExpoPushToken(sub.expoPushToken)) continue;
        messages.push({
          to: sub.expoPushToken,
          sound: "default",
          title,
          body,
          data: { url },
        });
      }

      const chunks = expo.chunkPushNotifications(messages);
      for (const chunk of chunks) {
        try {
          await expo.sendPushNotificationsAsync(chunk);
        } catch (error) {
          logger.error("Error sending push notification chunk", error);
        }
      }
    }
  } catch (error) {
    logger.error("Error sending push notification to user", error);
  }
};
