import dotenv from "dotenv";
import http from "http";
import app from "./app.js";
import connectDB from "./config/db.js";
import logger from "./utils/logger.js";
// import initializeSocket from "./config/socket.js";

dotenv.config();

const PORT = process.env.PORT || 5001;

// Connect to Database
connectDB();

// Create HTTP Server
const server = http.createServer(app);

// Wire Socket.io (Commented out by default)
// initializeSocket(server);

// Start Server
server.listen(PORT, () => {
  logger.success(`Server is running on port ${PORT}`);
});
