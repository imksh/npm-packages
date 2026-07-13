import bcrypt from "bcrypt";
import { prisma } from "../config/db.js";
import { sendOtpEmail } from "../utils/emailOtp.js";
import { uploadSingleToCloudinary, deleteFromCloudinary } from "../utils/cloudinaryUpload.js";
import logger from "../utils/logger.js";

export const authService = {
  signup: async ({ name, email, phone, password }: any) => {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      const err: any = new Error("User already exists");
      err.status = 409;
      throw err;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const photoURL = `https://placehold.co/600x400?text=${name.charAt(0).toUpperCase()}`;

    const newUser = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        phone,
        password: hashedPassword,
        avatarUrl: photoURL,
        avatarPublicId: "",
      },
    });

    return newUser;
  },

  login: async ({ email, password }: any) => {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      const err: any = new Error("User not found");
      err.status = 404;
      throw err;
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      const err: any = new Error("Invalid Credentials");
      err.status = 401;
      throw err;
    }

    return user;
  },

  generateOtp: async (email: string) => {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      const err: any = new Error("User not found");
      err.status = 404;
      throw err;
    }

    const existingOtp = await prisma.otp.findUnique({
      where: { email },
    });
    if (existingOtp) {
      await prisma.otp.delete({
        where: { email },
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);

    await prisma.otp.create({
      data: {
        email,
        otp: hashedOtp,
      },
    });

    await sendOtpEmail(email, otp);
    return true;
  },

  verifyOtp: async ({ email, otp }: any) => {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      const err: any = new Error("User not found");
      err.status = 404;
      throw err;
    }

    const existingOtp = await prisma.otp.findUnique({
      where: { email },
    });
    if (!existingOtp) {
      const err: any = new Error("OTP match failed");
      err.status = 400;
      throw err;
    }

    const isMatched = await bcrypt.compare(otp, existingOtp.otp);
    if (!isMatched) {
      const err: any = new Error("OTP match failed");
      err.status = 400;
      throw err;
    }

    return user;
  },

  resetPassword: async (user: any, newPassword: any) => {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });
    return true;
  },

  updateProfile: async (userId: any, { name, phone, file }: any) => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      const err: any = new Error("User not found");
      err.status = 404;
      throw err;
    }

    const updateData: any = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;

    if (file) {
      const uploadResult = await uploadSingleToCloudinary(file, {
        folder: "codelab/avatars",
      });

      if (user.avatarPublicId) {
        await deleteFromCloudinary(user.avatarPublicId).catch((err) =>
          logger.error("Old avatar delete error", err)
        );
      }

      updateData.avatarUrl = uploadResult.url;
      updateData.avatarPublicId = uploadResult.publicId;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    return updatedUser;
  },
};
