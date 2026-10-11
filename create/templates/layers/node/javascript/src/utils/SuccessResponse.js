export const SuccessResponse = (
  res,
  statusCode,
  message = "Success",
  data = null,
  pagination = undefined,
) => {
  return res.status(statusCode).json({
    success: statusCode < 400,
    statusCode,
    message,
    data,
    ...(pagination && { pagination }),
  });
};
