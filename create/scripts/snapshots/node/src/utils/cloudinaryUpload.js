import cloudinary from "../config/cloudinary.js";
import logger from "./logger.js";

const uploadToCloudinary = async (
  file,
  {
    folder = "uploads",
    width,
    height,
    crop,
    quality = "auto",
    format = "auto",
    ...options
  } = {},
) => {
  if (!file?.buffer) {
    throw new Error("Invalid file.");
  }

  const dataURI = `data:${file.mimetype};base64,${file.buffer.toString(
    "base64",
  )}`;

  const result = await cloudinary.uploader.upload(dataURI, {
    folder,
    width,
    height,
    crop,
    quality,
    format,
    ...options,
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
    assetId: result.asset_id,
    width: result.width,
    height: result.height,
    format: result.format,
    bytes: result.bytes,
  };
};

/**
 * Upload Single Image
 */
export const uploadSingleToCloudinary = async (
  file,
  options = {},
) => {
  try {
    return await uploadToCloudinary(file, options);
  } catch (error) {
    logger.error("Cloudinary Upload Error", error);
    throw new Error("Failed to upload image.");
  }
};

/**
 * Upload Multiple Images
 */
export const uploadMultipleToCloudinary = async (
  files = [],
  options = {},
) => {
  try {
    return await Promise.all(
      files.map((file) => uploadToCloudinary(file, options)),
    );
  } catch (error) {
    logger.error("Cloudinary Upload Error", error);
    throw new Error("Failed to upload images.");
  }
};

/**
 * Delete Image
 */
export const deleteFromCloudinary = async (publicId) => {
  try {
    return await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    logger.error("Cloudinary Delete Error", error);
    throw new Error("Failed to delete image.");
  }
};