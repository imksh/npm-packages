import dotenv from "dotenv";
import http from "http";
import app from "./app.js";
import connectDB from "./config/db.js";
import logger from "./utils/logger.js";

dotenv.config();

const PORT = process.env.PORT || 5001;

connectDB();

const server = http.createServer(app);

server.listen(PORT, () => {
  logger.success(`Server is running on port ${PORT}`);
});
