import * as authService from "../services/auth.service.js";
import { generateToken } from "../utils/jwt.js";
import genOtpToken from "../utils/genOtpToken.js";
import logger from "../utils/logger.js";

export const signup = async (req, res, next) => {
  try {
    const { name, email, phone, password, otp } = req.body;

    if (!email || !password || !name || !otp) {
      return next({ status: 400, message: "All fields are required." });
    }

    const newUser = await authService.signup({ name, email, phone, password, otp });
    const token = await generateToken(newUser, res);
    const safeUser = newUser.toObject();
    delete safeUser.password;

    res
      .status(201)
      .json({ message: "Registration Successful", data: safeUser, token });
  } catch (error) {
    logger.error("Error in signup controller", error);
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next({
        status: 400,
        message: "All fields are required.",
      });
    }

    const user = await authService.login({ email, password });
    const token = await generateToken(user, res);
    const safeUser = user.toObject();
    delete safeUser.password;

    res
      .status(200)
      .json({ message: "Login successfully", data: safeUser, token });
  } catch (error) {
    logger.error("Error in login controller", error);
    next(error);
  }
};

export const logout = async (_req, res, next) => {
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

export const getMe = async (req, res, next) => {
  try {
    const safeUser = req.user.toObject();
    delete safeUser.password;
    res.status(200).json({ message: "User Authenticated", data: safeUser });
  } catch (error) {
    logger.error("Error in getMe controller", error);
    next(error);
  }
};

export const genSignupOtp = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return next({ status: 400, message: "Email is required." });
    }

    await authService.generateSignupOtp(email);
    res.status(200).json({ message: "Signup Otp sent successfully" });
  } catch (error) {
    logger.error("Error in genSignupOtp", error);
    next(error);
  }
};

export const genOtp = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return next({
        status: 400,
        message: "Email is required.",
      });
    }

    await authService.generateOtp(email);
    res.status(200).json({ message: "Otp sent successfully" });
  } catch (error) {
    logger.error("Error in genOtp", error);
    next(error);
  }
};

export const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return next({
        status: 400,
        message: "All fields are required.",
      });
    }

    const user = await authService.verifyOtp({ email, otp });
    await genOtpToken(user, res);

    res.status(200).json({ message: "Otp verified successfully" });
  } catch (error) {
    logger.error("Error in verifyOtp", error);
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { newPassword } = req.body;
    const currentUser = req.user;
    if (!newPassword) {
      return next({
        status: 400,
        message: "All fields are required.",
      });
    }

    await authService.resetPassword(currentUser, newPassword);
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    logger.error("Error in resetPassword", error);
    next(error);
  }
};

export const updateMe = async (req, res, next) => {
  try {
    const { name, phone } = req.body;
    const user = await authService.updateProfile(req.user._id, {
      name,
      phone,
      file: req.file,
    });
    const safeUser = user.toObject();
    delete safeUser.password;
    res.status(200).json({ success: true, data: safeUser });
  } catch (error) {
    logger.error("Error updating profile", error);
    next(error);
  }
};
