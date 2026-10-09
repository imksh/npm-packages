import dotenv from "dotenv";
import http from "http";
import app from "./app.js";
import connectDB from "./config/prisma.js";
import logger from "./config/logger.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

connectDB();

const server = http.createServer(app);

server.listen(PORT, () => {
  logger.success(`Server is running on port ${PORT}`);
});
