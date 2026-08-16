import jwt from "jsonwebtoken";

export const generateToken = (user, res) => {
  const payload = { id: user._id || user.id };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "30d" });
  
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

export const verifyToken = (token) => {
  try {
    const JWT_SECRET = process.env.JWT_SECRET;
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};
