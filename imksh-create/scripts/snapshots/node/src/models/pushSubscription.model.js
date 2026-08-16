import mongoose from "mongoose";

// Handles both Web Push (endpoint + keys) and Expo Push (expoPushToken)
const pushSubscriptionSchema = new mongoose.Schema(
  {
    // Web Push fields
    endpoint: {
      type: String,
      sparse: true,
    },
    keys: {
      p256dh: { type: String },
      auth: { type: String },
    },

    // Expo Push field
    expoPushToken: {
      type: String,
      sparse: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      index: { expires: 0 },
    },
  },
  { timestamps: true },
);

export default mongoose.model("PushSubscription", pushSubscriptionSchema);
