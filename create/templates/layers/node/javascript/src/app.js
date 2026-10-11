import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import apiRoutes from "./routes/index.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";
import { apiLimiter } from "./middleware/rateLimiter.js";
import { SuccessResponse } from "./utils/SuccessResponse.js";

const app = express();

// Security and utility middlewares
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

// Rate limiting
app.use(apiLimiter);

// API Routes
app.use("/api", apiRoutes);

// Example health route
app.get("/api/health", (req, res) => {
  SuccessResponse(res, 200, "API is running");
});

// Error handling middlewares
app.use(notFound);
app.use(errorHandler);

export default app;
