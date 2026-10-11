import { Response } from "express";

export const SuccessResponse = (
  res: Response,
  statusCode: number,
  message: string = "Success",
  data: unknown = null,
  pagination?: unknown,
) => {
  return res.status(statusCode).json({
    success: statusCode < 400,
    statusCode,
    message,
    data,
    ...(pagination ? { pagination } : {}),
  });
};
