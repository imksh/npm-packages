import webpush from "../config/webPush.js";
import { Expo, ExpoPushMessage, ExpoPushTicket } from "expo-server-sdk";
import logger from "./logger.js";
import { prisma } from "../config/prisma.js";

const expo = new Expo();

export interface PushMessagePayload {
  title: string;
  body: string;
  data?: Record<string, unknown>;
  url?: string;
}

export const sendPushToUser = async (
  userId: string,
  title: string,
  body: string,
  url: string = "/",
) => {
  try {
    const subscriptions = await prisma.pushSubscription.findMany({
      where: { userId },
    });

    if (subscriptions.length === 0) return;

    const webSubs = subscriptions.filter(s => s.type === "WEB");
    const expoSubs = subscriptions.filter(s => s.type === "EXPO");

    // Web Push
    if (webSubs.length > 0) {
      const payload = JSON.stringify({ title, body, url });
      await Promise.allSettled(
        webSubs.map(async (sub) => {
          if (!sub.endpoint || !sub.keys) return;
          const pushSub = { endpoint: sub.endpoint, keys: sub.keys as any };
          try {
            await webpush.sendNotification(pushSub, payload);
          } catch (err: any) {
            if (err.statusCode === 404 || err.statusCode === 410) {
              await prisma.pushSubscription.delete({ where: { id: sub.id } }).catch(() => {});
            } else {
              logger.error("Web Push Error", err);
            }
          }
        })
      );
    }

    // Expo Push
    if (expoSubs.length > 0) {
      const messages: ExpoPushMessage[] = [];
      for (const sub of expoSubs) {
        if (!sub.token || !Expo.isExpoPushToken(sub.token)) continue;
        messages.push({
          to: sub.token,
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
