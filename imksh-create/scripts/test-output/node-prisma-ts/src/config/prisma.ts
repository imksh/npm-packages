import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";
import logger from "../utils/logger.js";

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({ adapter });

const connectDB = async () => {
  try {
    await prisma.$connect();
    logger.success("Prisma Database connected successfully");
  } catch (error: any) {
    logger.error(`Prisma Database connection failed: ${error.message}`, error);
    process.exit(1);
  }
};

export default connectDB;
