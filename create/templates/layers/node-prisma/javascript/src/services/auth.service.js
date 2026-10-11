import { OAuth2Client } from "google-auth-library";
import bcrypt from "bcrypt";
import { prisma } from "../config/db.js";
import { sendOtpEmail } from "../utils/emailOtp.js";
import { uploadSingleToCloudinary, deleteFromCloudinary } from "../utils/cloudinaryUpload.js";
import logger from "../utils/logger.js";
import { ApiError } from "../utils/ApiError.js";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || "");

export const signup = async ({ name, email, phone, password }) => {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });
  if (existingUser) {
    throw new ApiError(409, "User already exists");
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
};

export const login = async ({ email, password }) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new ApiError(401, "Invalid Credentials");
  }

  return user;
};

export const generateOtp = async (email) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!user) {
    throw new ApiError(404, "User not found");
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
};

export const verifyOtp = async ({ email, otp }) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const existingOtp = await prisma.otp.findUnique({
    where: { email },
  });
  if (!existingOtp) {
    throw new ApiError(400, "OTP match failed");
  }

  const isMatched = await bcrypt.compare(otp, existingOtp.otp);
  if (!isMatched) {
    throw new ApiError(400, "OTP match failed");
  }

  return user;
};

export const resetPassword = async (user, newPassword) => {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword },
  });
  return true;
};

export const updateProfile = async (userId, { name, phone, file }) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const updateData = {};
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
};

export const googleLogin = async (idToken) => {
  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  if (!payload) {
    throw new ApiError(401, "Invalid Google Token");
  }
  const { email, name, picture } = payload;
  if (!email) {
    throw new ApiError(400, "Email not found in Google Token");
  }

  let user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        name: name || "User",
        email: email.toLowerCase(),
        password: "",
        avatarUrl: picture || `https://placehold.co/600x400?text=${name?.charAt(0).toUpperCase() || 'U'}`,
        avatarPublicId: "",
      }
    });
  }
  return user;
};
