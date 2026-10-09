import mongoose, { Document } from "mongoose";

// Handles both Web Push (endpoint + keys) and Expo Push (expoPushToken)
export interface IPushSubscription extends Document {
  type: "WEB" | "EXPO";
  endpoint?: string;
  keys?: {
    p256dh: string;
    auth: string;
  };
  expoPushToken?: string;
  user?: mongoose.Types.ObjectId;
  role: "admin" | "user";
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const pushSubscriptionSchema = new mongoose.Schema<IPushSubscription>(
  {
    type: {
      type: String,
      enum: ["WEB", "EXPO"],
      default: "WEB",
    },
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

export default mongoose.model<IPushSubscription>("PushSubscription", pushSubscriptionSchema);
