export interface User {
  id: string; // Updated from _id for Prisma consistency
  _id?: string; // Fallback for mongo legacy if any
  name: string;
  email: string;
  phone?: string;
  role: string;
  avatar?: {
    url?: string;
    publicId?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}
