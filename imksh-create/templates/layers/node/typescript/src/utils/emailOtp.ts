import sendEmail from "../config/email.js";

const APP_NAME = process.env.APP_NAME || "My App";
const APP_URL = process.env.APP_URL || "";
const APP_PRIMARY_COLOR = process.env.APP_PRIMARY_COLOR || "#2563eb";

export const emailOtp = (otp: string, expiry = 10) => ({
  subject: `${APP_NAME} - Verification Code`,
  html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${APP_NAME}</title>
</head>
<body style="margin:0;padding:40px;background:#f3f4f6;font-family:Arial,sans-serif;">
  <div style="background:#fff;border-radius:12px;padding:30px;max-width:500px;margin:auto;">
    <h2>Verification Code</h2>
    <p>Your code is valid for ${expiry} minutes:</p>
    <div style="font-size:32px;font-weight:bold;color:${APP_PRIMARY_COLOR};text-align:center;margin:20px 0;">${otp}</div>
  </div>
</body>
</html>
`,
});

export const sendOtpEmail = async (to: string, otp: string, expiry = 10) => {
  const template = emailOtp(otp, expiry);
  await sendEmail(to, template.subject, template.html);
};
