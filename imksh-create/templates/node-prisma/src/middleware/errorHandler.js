/**
 * Not Found Middleware
 * Catches all unmatched requests and forwards a 404 error
 */
export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * Global Error Handler Middleware
 * Formats error responses nicely in JSON
 */
export const errorHandler = (err, req, res, next) => {
  const statusCode = err.status || err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);
  res.status(statusCode).json({
    success: false,
    message: err.message || "An unexpected error occurred",
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};
