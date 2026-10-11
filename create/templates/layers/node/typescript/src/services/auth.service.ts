import { OAuth2Client } from "google-auth-library";
import User, { type IUser } from "../models/user.model.js";
import Otp from "../models/otp.model.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt.js";
import { sendOtpEmail } from "../utils/emailOtp.js";
import {
  uploadSingleToCloudinary,
  deleteFromCloudinary,
  type CloudinaryUploadFile,
} from "../utils/cloudinaryUpload.js";
import logger from "../utils/logger.js";
import { ApiError } from "../utils/ApiError.js";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || "");

export interface SignupDTO {
  name: string;
  email: string;
  phone?: string;
  password: string;
  otp: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface VerifyOtpDTO {
  email: string;
  otp: string;
}

export interface UpdateProfileDTO {
  name?: string;
  phone?: string;
  file?: CloudinaryUploadFile;
}

export interface UserWithSave {
  password?: string;
  save: () => Promise<unknown>;
}

export const signup = async ({ name, email, phone, password, otp }: SignupDTO) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "User already exists");
  }

  const existingOtp = await Otp.findOne({ email });
  if (!existingOtp) {
    throw new ApiError(400, "OTP match failed");
  }
  const isMatched = await bcrypt.compare(otp, existingOtp.otp);
  if (!isMatched) {
    throw new ApiError(400, "OTP match failed");
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const photoURL = `https://placehold.co/600x400?text=${name.charAt(0).toUpperCase()}`;
  const newUser = await User.create({
    name,
    email: email.toLowerCase(),
    phone,
    role: "user",
    password: hashedPassword,
    avatar: { url: photoURL, publicId: "" },
  });

  await existingOtp.deleteOne(); // delete OTP after successful signup
  return newUser;
};

export const login = async ({ email, password }: LoginDTO) => {
  const user = await User.findOne({ email });
  if (!user || !user.password) {
    throw new ApiError(401, "Invalid Credentials");
  }
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new ApiError(401, "Invalid Credentials");
  }
  return user;
};

export const generateSignupOtp = async (email: string) => {
  const user = await User.findOne({ email });
  if (user) {
    throw new ApiError(409, "User already exists");
  }
  const existingOtp = await Otp.findOne({ email });
  if (existingOtp) {
    await existingOtp.deleteOne();
  }
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedOtp = await bcrypt.hash(otp, 10);
  await Otp.create({ email, otp: hashedOtp });
  await sendOtpEmail(email, otp);
  return true;
};

export const generateOtp = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const existingOtp = await Otp.findOne({ email });
  if (existingOtp) {
    await existingOtp.deleteOne();
  }
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedOtp = await bcrypt.hash(otp, 10);
  await Otp.create({ email, otp: hashedOtp });
  await sendOtpEmail(email, otp);
  return true;
};

export const verifyOtp = async ({ email, otp }: VerifyOtpDTO) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const existingOtp = await Otp.findOne({ email });
  if (!existingOtp) {
    throw new ApiError(400, "OTP match failed");
  }
  const isMatched = await bcrypt.compare(otp, existingOtp.otp);
  if (!isMatched) {
    throw new ApiError(400, "OTP match failed");
  }
  return user;
};

export const resetPassword = async (user: UserWithSave, newPassword: string) => {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();
  return true;
};

export const updateProfile = async (
  userId: string,
  { name, phone, file }: UpdateProfileDTO,
) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  if (name) user.name = name;
  if (phone) user.phone = phone;
  if (file) {
    const uploadResult = await uploadSingleToCloudinary(file, {
      folder: "codelab/avatars",
    });
    if (user.avatar && user.avatar.publicId) {
      await deleteFromCloudinary(user.avatar.publicId).catch((err) =>
        logger.error("Old avatar delete error", err),
      );
    }
    user.avatar = { url: uploadResult.url, publicId: uploadResult.publicId };
  }
  await user.save();
  return user;
};

/**
 * Save Expo Push Token
 */
export const savePushToken = async (userId: string, token: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  if (!user.expoPushTokens.includes(token)) {
    user.expoPushTokens.push(token);
    await user.save();
  }
  return user;
};

export const googleLogin = async (idToken: string) => {
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

  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({
      name: name || "User",
      email: email.toLowerCase(),
      role: "user",
      password: "",
      avatar: { url: picture || `https://placehold.co/600x400?text=${name?.charAt(0).toUpperCase() || 'U'}`, publicId: "" },
    });
  }
  return user;
};
