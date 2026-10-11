import * as authService from "../services/auth.service.js";
import { generateToken } from "../utils/jwt.js";
import genOtpToken from "../utils/genOtpToken.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { SuccessResponse } from "../utils/SuccessResponse.js";
import { ApiError } from "../utils/ApiError.js";

export const signup = asyncHandler(async (req, res) => {
  const { name, email, phone, password } = req.body;
  if (!email || !password || !name) {
    throw new ApiError(400, "All fields are required.");
  }
  const newUser = await authService.signup({ name, email, phone, password });
  const token = await generateToken(newUser, res);
  const safeUser = { ...newUser };
  delete safeUser.password;
  SuccessResponse(res, 201, "Registration Successful", { user: safeUser, token });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(400, "All fields are required.");
  }
  const user = await authService.login({ email, password });
  const token = await generateToken(user, res);
  const safeUser = { ...user };
  delete safeUser.password;
  SuccessResponse(res, 200, "Login successfully", { user: safeUser, token });
});

export const logout = asyncHandler(async (_req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });
  SuccessResponse(res, 200, "Logout Successfully");
});

export const getMe = asyncHandler(async (req, res) => {
  const safeUser = { ...req.user };
  delete safeUser.password;
  SuccessResponse(res, 200, "User Authenticated", safeUser);
});

export const genOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new ApiError(400, "Email is required.");
  }
  await authService.generateOtp(email);
  SuccessResponse(res, 200, "Otp sent successfully");
});

export const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    throw new ApiError(400, "All fields are required.");
  }
  const user = await authService.verifyOtp({ email, otp });
  await genOtpToken(user, res);
  SuccessResponse(res, 200, "Otp verified successfully");
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { newPassword } = req.body;
  const currentUser = req.user;
  if (!newPassword) {
    throw new ApiError(400, "All fields are required.");
  }
  await authService.resetPassword(currentUser, newPassword);
  SuccessResponse(res, 200, "Password updated successfully");
});

export const updateMe = asyncHandler(async (req, res) => {
  const { name, phone } = req.body;
  const user = await authService.updateProfile(req.user.id, {
    name,
    phone,
    file: req.file,
  });
  const safeUser = { ...user };
  delete safeUser.password;
  SuccessResponse(res, 200, "Profile updated successfully", safeUser);
});

export const googleLogin = asyncHandler(async (req, res) => {
  const { idToken } = req.body;
  if (!idToken) {
    throw new ApiError(400, "idToken is required.");
  }
  const user = await authService.googleLogin(idToken);
  const token = await generateToken(user, res);
  const safeUser = user;
  if (safeUser.password !== undefined) {
    delete safeUser.password;
  }
  SuccessResponse(res, 200, "Google Login successfully", { user: safeUser, token });
});
