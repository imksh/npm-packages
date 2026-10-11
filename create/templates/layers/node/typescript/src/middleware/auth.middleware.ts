import { Request, Response, NextFunction } from "express";
import User from "../models/user.model.js";
import { verifyToken } from "../utils/jwt.js";
import logger from "../utils/logger.js";
import { ApiError } from "../utils/ApiError.js";

export const protect = async (
  req: Request,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  res: Response,
  next: NextFunction
) => {
  let token: string | undefined;

  if (req.cookies?.token) {
    token = req.cookies.token;
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new ApiError(401, "Not authorized, no token provided"));
  }

  try {
    const decoded = verifyToken(token) as { id: string } | null;
    if (!decoded) {
      return next(new ApiError(401, "Not authorized, invalid token"));
    }

    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) {
      return next(new ApiError(401, "Not authorized, user not found"));
    }

    return next();
  } catch (error: unknown) {
    logger.error("Auth middleware error", error);
    return next(new ApiError(401, "Not authorized, token verification failed"));
  }
};
