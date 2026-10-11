import { PrismaClient } from "@prisma/client";
import logger from "../utils/logger.js";

export const prisma = new PrismaClient();

const connectDB = async () => {
  try {
    await prisma.$connect();
    logger.success("Prisma Database connected successfully");
  } catch (error: unknown) {
    const err = error as Error;
    logger.error(`Prisma Database connection failed: ${err.message}`, error);
    process.exit(1);
  }
};

export default connectDB;
