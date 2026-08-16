import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.js";
import logger from "../utils/logger.js";
import { prisma } from "../config/db.js";

export const protect = async (req: Request, res: Response, next: NextFunction) => {
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
    return res.status(401).json({ message: "Not authorized, no token provided" });
  }

  try {
    const decoded: any = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ message: "Not authorized, invalid token" });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return res.status(401).json({ message: "Not authorized, user not found" });
    }

    const safeUser: any = { ...user };
    delete safeUser.password;

    req.user = safeUser;
    return next();
  } catch (error: any) {
    logger.error("Auth middleware error", error);
    return res.status(401).json({ message: "Not authorized, token verification failed" });
  }
};
