import webpush from "web-push";
import { Expo, ExpoPushMessage } from "expo-server-sdk";
import prisma from "../../config/prisma.js";
import logger from "../../config/logger.js";

// Initialize Web Push
webpush.setVapidDetails(
  (process.env.VAPID_SUBJECT as string) || "",
  (process.env.VAPID_PUBLIC_KEY as string) || "",
  (process.env.VAPID_PRIVATE_KEY as string) || ""
);

export default webpush;

// Initialize Expo Push
const expo = new Expo();

export const sendPushNotification = async (
  userId: string,
  title: string,
  body: string,
  data?: Record<string, unknown>
) => {
  try {
    // 1. Fetch all Expo push tokens for the user
    const subscriptions = await prisma.pushSubscription.findMany({
      where: {
        userId,
        type: "EXPO",
        token: { not: null },
      },
    });

    if (subscriptions.length === 0) return;

    // 2. Create the messages
    const messages: ExpoPushMessage[] = [];
    for (const sub of subscriptions) {
      if (!sub.token || !Expo.isExpoPushToken(sub.token)) {
        logger.error(`Push token ${sub.token} is not a valid Expo push token`);
        continue;
      }

      messages.push({
        to: sub.token,
        sound: "default",
        title,
        body,
        data,
      });
    }

    // 3. Send the messages
    const chunks = expo.chunkPushNotifications(messages);
    for (const chunk of chunks) {
      try {
        await expo.sendPushNotificationsAsync(chunk);
      } catch (error) {
        logger.error("Error sending chunk of push notifications:", error);
      }
    }
  } catch (error) {
    logger.error("Failed to send push notification:", error);
  }
};
