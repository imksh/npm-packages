import rateLimit from "express-rate-limit";
import { Request, Response } from "express";

interface LimiterConfig {
  windowMs: number;
  max: number;
  message: string;
  skipSuccessfulRequests?: boolean;
}

const createLimiter = ({
  windowMs,
  max,
  message,
  skipSuccessfulRequests = false,
}: LimiterConfig) =>
  rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests,

    keyGenerator: (req: any) => {
      return req.user?.id || req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    },

    handler: (req: Request, res: Response) => {
      res.status(429).json({
        success: false,
        message,
      });
    },
  });

export const apiLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests. Please try again later.",
});

export const authLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  skipSuccessfulRequests: true,
  message: "Too many login attempts. Please try again later.",
});

export const uploadLimiter = createLimiter({
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: "Upload limit reached. Please try again in an hour.",
});
