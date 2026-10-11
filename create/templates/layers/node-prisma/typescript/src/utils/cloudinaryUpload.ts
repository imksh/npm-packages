import cloudinary from "../config/cloudinary.js";
import logger from "./logger.js";

export interface CloudinaryUploadFile {
  mimetype?: string;
  buffer?: Buffer;
  [key: string]: unknown;
}

export interface CloudinaryOptions {
  folder?: string;
  [key: string]: unknown;
}

const uploadToCloudinary = async (file: CloudinaryUploadFile, options: CloudinaryOptions = {}) => {
  if (!file?.buffer) {
    throw new Error("Invalid file.");
  }
  const dataURI = `data:${file.mimetype || "application/octet-stream"};base64,${file.buffer.toString("base64")}`;
  const result = await cloudinary.uploader.upload(dataURI, {
    folder: options.folder || "uploads",
    ...options,
  });
  return {
    url: result.secure_url,
    publicId: result.public_id,
  };
};

export const uploadSingleToCloudinary = async (file: CloudinaryUploadFile, options: CloudinaryOptions = {}) => {
  try {
    return await uploadToCloudinary(file, options);
  } catch (error: unknown) {
    logger.error("Cloudinary Upload Error", error);
    throw new Error("Failed to upload image.");
  }
};

export const uploadMultipleToCloudinary = async (files: CloudinaryUploadFile[] = [], options: CloudinaryOptions = {}) => {
  try {
    return await Promise.all(files.map((file) => uploadToCloudinary(file, options)));
  } catch (error: unknown) {
    logger.error("Cloudinary Upload Error", error);
    throw new Error("Failed to upload images.");
  }
};

export const deleteFromCloudinary = async (publicId: string) => {
  try {
    return await cloudinary.uploader.destroy(publicId);
  } catch (error: unknown) {
    logger.error("Cloudinary Delete Error", error);
    throw new Error("Failed to delete image.");
  }
};
