import mongoose from "mongoose";
import logger from "../utils/logger.js";

const connectDB = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/test";
    const conn = await mongoose.connect(MONGO_URI);
    logger.success(`MongoDB connected: ${conn.connection.host}`);
  } catch (error: unknown) {
    const err = error as Error;
    logger.error(`MongoDB connection error: ${err.message}`, error);
    process.exit(1);
  }
};

export default connectDB;
