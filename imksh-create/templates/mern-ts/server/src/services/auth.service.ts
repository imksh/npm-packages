import User from "../models/user.model.js";
import Otp from "../models/otp.model.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt.js";
import { sendOtpEmail } from "../utils/emailOtp.js";
import {
  uploadSingleToCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinaryUpload.js";
import logger from "../utils/logger.js";

export const signup = async ({ name, email, phone, password, otp }: any) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const err: any = new Error("User already exists");
    err.status = 409;
    throw err;
  }

  const existingOtp = await Otp.findOne({ email });
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
export const login = async ({ email, password }: any) => {
  const user = await User.findOne({ email });
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
};
export const generateSignupOtp = async (email: string) => {
  const user = await User.findOne({ email });
  if (user) {
    const err: any = new Error("User already exists");
    err.status = 409;
    throw err;
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
    const err: any = new Error("User not found");
    err.status = 404;
    throw err;
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
export const verifyOtp = async ({ email, otp }: any) => {
  const user = await User.findOne({ email });
  if (!user) {
    const err: any = new Error("User not found");
    err.status = 404;
    throw err;
  }
  const existingOtp = await Otp.findOne({ email });
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
};
export const resetPassword = async (user: any, newPassword: any) => {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();
  return true;
};
export const updateProfile = async (
  userId: any,
  { name, phone, file }: any,
) => {
  const user = await User.findById(userId);
  if (!user) {
    const err: any = new Error("User not found");
    err.status = 404;
    throw err;
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
