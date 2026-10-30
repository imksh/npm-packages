export const SuccessResponse = (
  res,
  statusCode,
  message = "Success",
  data = null,
  pagination,
) => {
  return res.status(statusCode).json({
    success: statusCode < 400,
    statusCode,
    message,
    data,
    ...(pagination
      ? {
          pagination,
        }
      : {}),
  });
};
