import { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth.service.js";
import { generateToken } from "../utils/jwt.js";
import genOtpToken from "../utils/genOtpToken.js";
import logger from "../utils/logger.js";

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!email || !password || !name) {
      return next({ status: 400, message: "All fields are required." });
    }
    const newUser = await authService.signup({ name, email, phone, password });
    const token = await generateToken(newUser, res);
    const safeUser: any = { ...newUser };
    delete safeUser.password;
    res.status(201).json({ message: "Registration Successful", data: safeUser, token });
  } catch (error) {
    logger.error("Error in signup controller", error);
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next({ status: 400, message: "All fields are required." });
    }
    const user = await authService.login({ email, password });
    const token = await generateToken(user, res);
    const safeUser: any = { ...user };
    delete safeUser.password;
    res.status(200).json({ message: "Login successfully", data: safeUser, token });
  } catch (error) {
    logger.error("Error in login controller", error);
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });
    res.status(200).json({ message: "Logout Successfully" });
  } catch (error) {
    logger.error("Error in logout controller", error);
    next(error);
  }
};

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).json({ message: "User Authenticated", data: req.user });
  } catch (error) {
    logger.error("Error in getMe controller", error);
    next(error);
  }
};

export const genOtp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    if (!email) {
      return next({ status: 400, message: "Email is required." });
    }
    await authService.generateOtp(email);
    res.status(200).json({ message: "Otp sent successfully" });
  } catch (error) {
    logger.error("Error in genOtp", error);
    next(error);
  }
};

export const verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return next({ status: 400, message: "All fields are required." });
    }
    const user = await authService.verifyOtp({ email, otp });
    await genOtpToken(user, res);
    res.status(200).json({ message: "Otp verified successfully" });
  } catch (error) {
    logger.error("Error in verifyOtp", error);
    next(error);
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { newPassword } = req.body;
    const currentUser = req.user;
    if (!newPassword) {
      return next({ status: 400, message: "All fields are required." });
    }
    await authService.resetPassword(currentUser, newPassword);
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    logger.error("Error in resetPassword", error);
    next(error);
  }
};

export const updateMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, phone } = req.body;
    const user = await authService.updateProfile(req.user.id, {
      name,
      phone,
      file: req.file,
    });
    const safeUser: any = { ...user };
    delete safeUser.password;
    res.status(200).json({ success: true, data: safeUser });
  } catch (error) {
    logger.error("Error updating profile", error);
    next(error);
  }
};
