// import dotenv from "dotenv";
// dotenv.config();
import nodemailer from "nodemailer";
import logger from "../utils/logger.js";

const sendEmail = async (to, subject, message) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: to,
      subject: subject,
      html: message,
    };

    const res = await transporter.sendMail(mailOptions);
    logger.success(`Email sent to ${to}: ${res.messageId}`);
  } catch (error) {
    logger.error("Failed to send email", error);
  }
};

export default sendEmail;
