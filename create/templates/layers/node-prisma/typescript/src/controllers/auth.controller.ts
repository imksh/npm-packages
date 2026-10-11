import { Request, Response } from "express";
import * as authService from "../services/auth.service.js";
import { generateToken } from "../utils/jwt.js";
import genOtpToken from "../utils/genOtpToken.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { SuccessResponse } from "../utils/SuccessResponse.js";
import { ApiError } from "../utils/ApiError.js";

const toSafeUser = (user: unknown): Record<string, unknown> => {
  const safeUser: Record<string, unknown> = { ...((user as Record<string, unknown>) || {}) };
  delete safeUser.password;
  return safeUser;
};

export const signup = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, phone, password } = req.body;
  if (!email || !password || !name) {
    throw new ApiError(400, "All fields are required.");
  }
  const newUser = await authService.signup({ name, email, phone, password });
  const token = await generateToken(newUser, res);
  const safeUser = toSafeUser(newUser);
  SuccessResponse(res, 201, "Registration Successful", { user: safeUser, token });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(400, "All fields are required.");
  }
  const user = await authService.login({ email, password });
  const token = await generateToken(user, res);
  const safeUser = toSafeUser(user);
  SuccessResponse(res, 200, "Login successfully", { user: safeUser, token });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });
  SuccessResponse(res, 200, "Logout Successfully");
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const safeUser = toSafeUser(req.user);
  SuccessResponse(res, 200, "User Authenticated", safeUser);
});

export const genOtp = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    throw new ApiError(400, "Email is required.");
  }
  await authService.generateOtp(email);
  SuccessResponse(res, 200, "Otp sent successfully");
});

export const verifyOtp = asyncHandler(async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    throw new ApiError(400, "All fields are required.");
  }
  const user = await authService.verifyOtp({ email, otp });
  await genOtpToken(user, res);
  SuccessResponse(res, 200, "Otp verified successfully");
});

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { newPassword } = req.body;
  const userId = String(req.user?.id || req.user?._id || "");
  if (!newPassword) {
    throw new ApiError(400, "All fields are required.");
  }
  if (!userId) {
    throw new ApiError(401, "Not authorized");
  }
  await authService.resetPassword({ id: userId }, newPassword);
  SuccessResponse(res, 200, "Password updated successfully");
});

export const updateMe = asyncHandler(async (req: Request, res: Response) => {
  const { name, phone } = req.body;
  const userId = String(req.user?.id || req.user?._id || "");
  if (!userId) {
    throw new ApiError(401, "Not authorized");
  }
  const user = await authService.updateProfile(userId, {
    name,
    phone,
    file: req.file,
  });
  const safeUser = toSafeUser(user);
  SuccessResponse(res, 200, "Profile updated successfully", safeUser);
});

export const googleLogin = asyncHandler(async (req: Request, res: Response) => {
  const { idToken } = req.body;
  if (!idToken) {
    throw new ApiError(400, "idToken is required.");
  }
  const user = await authService.googleLogin(idToken);
  const token = await generateToken(user, res);
  const safeUser = toSafeUser(user);
  SuccessResponse(res, 200, "Google Login successfully", { user: safeUser, token });
});
