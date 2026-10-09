import { Expo, ExpoPushMessage, ExpoPushTicket } from "expo-server-sdk";
import User, {type IUser } from "../models/user.model.js";
import logger from "./logger.js";
import mongoose from "mongoose";

// Create a new Expo SDK client
// optionally providing an access token if you have enabled push security
const expo = new Expo();

export interface PushMessagePayload {
  title: string;
  body: string;
  data?: Record<string, any>;
}

/**
 * Sends a push notification to specific users
 * 
 * @param userIds - Array of User ObjectIds
 * @param message - Notification payload
 */
export const sendPushNotification = async (
  userIds: (string | mongoose.Types.ObjectId)[],
  { title, body, data = {} }: PushMessagePayload
): Promise<ExpoPushTicket[] | void> => {
  try {
    // 1. Fetch users and collect all their push tokens
    const users = await User.find({ _id: { $in: userIds } });
    
    let pushTokens: string[] = [];
    users.forEach((user:IUser) => {
      if (user.expoPushTokens && user.expoPushTokens.length > 0) {
        pushTokens.push(...user.expoPushTokens);
      }
    });

    if (pushTokens.length === 0) {
      logger.info("No push tokens found for provided users.");
      return;
    }

    // 2. Filter out invalid tokens
    let messages: ExpoPushMessage[] = [];
    for (let pushToken of pushTokens) {
      if (!Expo.isExpoPushToken(pushToken)) {
        logger.warn(`Push token ${pushToken} is not a valid Expo push token`);
        continue;
      }

      messages.push({
        to: pushToken,
        sound: "default",
        title,
        body,
        data,
      });
    }

    // 3. Chunk the messages to comply with Expo's API limits
    let chunks = expo.chunkPushNotifications(messages);
    let tickets: ExpoPushTicket[] = [];

    // 4. Send the chunks to the Expo push notification service
    for (let chunk of chunks) {
      try {
        let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        tickets.push(...ticketChunk);
      } catch (error) {
        logger.error("Error sending push notification chunk", error);
      }
    }

    // NOTE: In a production app, you should also process the tickets later 
    // to find and remove unregistered tokens from your database.
    return tickets;
  } catch (error) {
    logger.error("Error in sendPushNotification util:", error);
    throw error;
  }
};
