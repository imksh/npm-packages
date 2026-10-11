import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError.js";

export interface HttpError extends Error {
  statusCode?: number;
  status?: number;
  errors?: unknown[];
}

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  next(new ApiError(404, `Not Found - ${req.originalUrl}`));
};

export const errorHandler = (
  err: HttpError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  const statusCode = err.statusCode || err.status || (res.statusCode === 200 ? 500 : res.statusCode);
  res.status(statusCode).json({
    success: false,
    statusCode,
    message: err.message || "An unexpected error occurred",
    errors: err.errors || [],
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};
