import rateLimit from "express-rate-limit";

const createLimiter = ({
  windowMs,
  max,
  message,
  skipSuccessfulRequests = false,
}) =>
  rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests,

    keyGenerator: (req) => {
      return req.user?.id || req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    },

    handler: (req, res) => {
      res.status(429).json({
        success: false,
        message,
      });
    },
  });

/**
 * General API Limiter
 * 100 requests / 15 minutes
 */
export const apiLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests. Please try again later.",
});

/**
 * Authentication Limiter
 * 10 failed attempts / 15 minutes
 */
export const authLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  skipSuccessfulRequests: true,
  message: "Too many login attempts. Please try again later.",
});

/**
 * Upload Limiter
 * 20 uploads / hour
 */
export const uploadLimiter = createLimiter({
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: "Upload limit reached. Please try again in an hour.",
});