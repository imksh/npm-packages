import jwt from "jsonwebtoken";
import { Response } from "express";

export const generateToken = (user: any, res?: Response) => {
  const payload = { id: user._id || user.id };
  const JWT_SECRET = process.env.JWT_SECRET || "fallbacksecret";
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "30d" });
  
  if (res) {
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
  }
  return token;
};

export const verifyToken = (token: string) => {
  try {
    const JWT_SECRET = process.env.JWT_SECRET || "fallbacksecret";
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};
