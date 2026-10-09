import { PrismaClient } from "@prisma/client";
import logger from "../utils/logger.js";

export const prisma = new PrismaClient();

const connectDB = async () => {
  try {
    await prisma.$connect();
    logger.success("Prisma Database connected successfully");
  } catch (error) {
    logger.error("Prisma Database connection failed", error);
    process.exit(1);
  }
};

export default connectDB;
