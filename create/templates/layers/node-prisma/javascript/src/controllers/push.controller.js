import { prisma } from "../config/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { SuccessResponse } from "../utils/SuccessResponse.js";
import { ApiError } from "../utils/ApiError.js";

export const subscribe = asyncHandler(async (req, res) => {
  const subscription = req.body;
  const userId = req.user?._id || req.user?.id;

  if (!subscription) {
    throw new ApiError(400, "Invalid subscription payload");
  }

  // Determine type: EXPO if token is present, else WEB
  const isExpo = !!subscription.token;
  const isWeb = !!(subscription.endpoint && subscription.keys);

  if (!isExpo && !isWeb) {
    throw new ApiError(400, "Missing token (EXPO) or endpoint/keys (WEB)");
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
      return SuccessResponse(res, 200, "Already subscribed.");
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
      return SuccessResponse(res, 200, "Already subscribed.");
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

  SuccessResponse(res, 201, "Subscription created.");
});

export const unsubscribe = asyncHandler(async (req, res) => {
  const { endpoint } = req.body;
  if (!endpoint) {
    throw new ApiError(400, "Endpoint required");
  }

  await prisma.pushSubscription.delete({ where: { endpoint } }).catch(() => {});

  SuccessResponse(res, 200, "Unsubscribed.");
});
