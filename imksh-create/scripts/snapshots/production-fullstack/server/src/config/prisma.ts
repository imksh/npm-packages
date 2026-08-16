import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import logger from "./logger.js";
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({ adapter });

const connectDB = async () => {
  try {
    await prisma.$connect();
    logger.success("Prisma Database connected successfully");
  } catch (error: unknown) {
    const err = error as Error;
    logger.error(`Prisma Database connection failed: ${err.message}`, err);
    process.exit(1);
  }
};

export default connectDB;
