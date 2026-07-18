import mongoose, { Document } from "mongoose";

export interface IPushSubscription extends Document {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
  user?: mongoose.Types.ObjectId;
  role: "admin" | "user";
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const pushSubscriptionSchema = new mongoose.Schema<IPushSubscription>(
  {
    endpoint: {
      type: String,
      required: true,
      unique: true,
    },
    keys: {
      p256dh: { type: String, required: true },
      auth: { type: String, required: true },
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
