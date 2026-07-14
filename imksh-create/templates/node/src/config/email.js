// import dotenv from "dotenv";
// dotenv.config();
import nodemailer from "nodemailer";
import logger from "../utils/logger.js";

const sendEmail = async (to, subject, message) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSCODE,
      },
    });

    const mailOptions = {
      from: process.env.GMAIL_USER,
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
