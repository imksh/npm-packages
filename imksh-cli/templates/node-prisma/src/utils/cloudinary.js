import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage engine for profile images / file submissions
const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => ({
    folder: "lms-uploads",
    allowed_formats: ["jpg", "jpeg", "png", "gif", "pdf", "webp"],
    resource_type: file.mimetype.startsWith("image/") ? "image" : "raw",
    public_id: `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`,
  }),
});

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB cap
});

export { cloudinary };
