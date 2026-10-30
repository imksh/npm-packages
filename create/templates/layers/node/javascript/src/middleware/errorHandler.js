import { ApiError } from "../utils/ApiError.js";
export const notFound = (req, res, next) => {
  next(new ApiError(404, `Not Found - ${req.originalUrl}`));
};
export const errorHandler = (err, req, res, next) => {
  const statusCode =
    err.statusCode ||
    err.status ||
    (res.statusCode === 200 ? 500 : res.statusCode);
  res.status(statusCode).json({
    success: false,
    statusCode,
    message: err.message || "An unexpected error occurred",
    errors: err.errors || [],
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};
