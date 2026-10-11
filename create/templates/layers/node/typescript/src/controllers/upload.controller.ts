import { Request, Response } from "express";
import { uploadSingleToCloudinary } from "../utils/cloudinaryUpload.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { SuccessResponse } from "../utils/SuccessResponse.js";
import { ApiError } from "../utils/ApiError.js";

export const uploadFile = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    throw new ApiError(400, "No file uploaded");
  }
  const result = await uploadSingleToCloudinary(req.file, {
    folder: req.body.folder || "general_uploads",
  });
  SuccessResponse(res, 200, "File uploaded successfully", result);
});
