import { Request, Response } from "express";
import PushSubscription from "../models/pushSubscription.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { SuccessResponse } from "../utils/SuccessResponse.js";
import { ApiError } from "../utils/ApiError.js";

export const subscribe = asyncHandler(async (req: Request, res: Response) => {
  const subscription = req.body;
  const userId = req.user?._id || req.user?.id; // supports both mongoose and prisma IDs

  if (!subscription) {
    throw new ApiError(400, "Invalid subscription payload");
  }

  const isExpo = !!subscription.token;
  const isWeb = !!(subscription.endpoint && subscription.keys);

  if (!isExpo && !isWeb) {
    throw new ApiError(400, "Missing token (EXPO) or endpoint/keys (WEB)");
  }

  if (isExpo) {
    const existingSub = await PushSubscription.findOne({ expoPushToken: subscription.token });
    if (existingSub) {
      if (userId && String(existingSub.user) !== String(userId)) {
        existingSub.user = userId;
        await existingSub.save();
      }
      return SuccessResponse(res, 200, "Already subscribed.");
    }

    await PushSubscription.create({
      type: "EXPO",
      expoPushToken: subscription.token,
      user: userId || undefined,
    });
  } else {
    const existingSub = await PushSubscription.findOne({ endpoint: subscription.endpoint });
    if (existingSub) {
      if (userId && String(existingSub.user) !== String(userId)) {
        existingSub.user = userId;
        await existingSub.save();
      }
      return SuccessResponse(res, 200, "Already subscribed.");
    }

    await PushSubscription.create({
      type: "WEB",
      endpoint: subscription.endpoint,
      keys: subscription.keys,
      user: userId || undefined,
    });
  }

  SuccessResponse(res, 201, "Subscription created.");
});

export const unsubscribe = asyncHandler(async (req: Request, res: Response) => {
  const { endpoint } = req.body;
  if (!endpoint) {
    throw new ApiError(400, "Endpoint required");
  }

  await PushSubscription.deleteOne({ endpoint });
  SuccessResponse(res, 200, "Unsubscribed.");
});
