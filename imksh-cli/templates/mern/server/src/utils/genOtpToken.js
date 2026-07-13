import jwt from "jsonwebtoken";

const genOtpToken = (user, res) => {
  const token = jwt.sign({ id: user._id || user.id }, process.env.JWT_SECRET, {
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
