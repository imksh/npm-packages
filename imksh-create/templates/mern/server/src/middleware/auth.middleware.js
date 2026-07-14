import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { verifyToken } from "../utils/jwt.js";
import logger from "../utils/logger.js";

export const protect = async (req, res, next) => {
  let token;
  if (req.cookies?.token) {
    token = req.cookies.token;
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res
      .status(401)
      .json({ message: "Not authorized, no token provided" });
  }

  try {
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ message: "Not authorized, invalid token" });
    }

    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Not authorized, user not found" });
    }

    return next();
  } catch (error) {
    logger.error("Auth middleware error", error);
    return res
      .status(401)
      .json({ message: "Not authorized, token verification failed" });
  }
};
