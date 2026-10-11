import { ApiError } from "../utils/ApiError.js";

/**
 * Not Found Middleware
 * Catches all unmatched requests and forwards a 404 error
 */
export const notFound = (req, res, next) => {
  next(new ApiError(404, `Not Found - ${req.originalUrl}`));
};

/**
 * Global Error Handler Middleware
 * Formats error responses nicely in JSON
 */
export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || err.status || (res.statusCode === 200 ? 500 : res.statusCode);
  res.status(statusCode).json({
    success: false,
    statusCode,
    message: err.message || "An unexpected error occurred",
    errors: err.errors || [],
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};
