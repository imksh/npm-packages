import type { CloudinaryUploadFile } from "../utils/cloudinaryUpload.js";

export {};

declare global {
  namespace Express {
    interface Request {
      user?: Record<string, unknown> & { _id?: unknown; id?: unknown; toObject?: () => Record<string, unknown> };
      file?: CloudinaryUploadFile;
    }
  }
}
