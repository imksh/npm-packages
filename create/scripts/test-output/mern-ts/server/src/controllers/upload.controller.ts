import { Request, Response, NextFunction } from "express";
import { uploadSingleToCloudinary } from "../utils/cloudinaryUpload.js";
import logger from "../utils/logger.js";

export const uploadFile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }
    const result = await uploadSingleToCloudinary(req.file, {
      folder: req.body.folder || "general_uploads",
    });
    res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      data: result,
    });
  } catch (error) {
    logger.error("Upload controller error", error);
    next(error);
  }
};
