import jwt from "jsonwebtoken";
import { Response } from "express";

const genOtpToken = (user: any, res?: Response) => {
  const JWT_SECRET = process.env.JWT_SECRET || "fallbacksecret";
  const token = jwt.sign({ id: user._id || user.id }, JWT_SECRET, {
    expiresIn: "10m",
  });

  if (res) {
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 10 * 60 * 1000, // 10 minutes
    });
  }

  return token;
};

export default genOtpToken;
