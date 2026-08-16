import sendEmail from "../config/email.js";

const APP_NAME = process.env.APP_NAME || "My App";
const APP_URL = process.env.APP_URL || "";
const APP_PRIMARY_COLOR =
  process.env.APP_PRIMARY_COLOR || "#2563eb";

export const emailOtp = (otp, expiry = 10) => ({
  subject: `${APP_NAME} - Verification Code`,
  html: `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${APP_NAME}</title>
</head>

<body style="margin:0;padding:40px;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center">

        <table
          width="600"
          cellpadding="0"
          cellspacing="0"
          style="
            background:#ffffff;
            border-radius:16px;
            overflow:hidden;
            box-shadow:0 10px 30px rgba(0,0,0,.08);
          "
        >

          <!-- Header -->
          <tr>
            <td
              align="center"
              style="
                background:${APP_PRIMARY_COLOR};
                padding:30px;
              "
            >
              <h1
                style="
                  margin:0;
                  color:#ffffff;
                  font-size:26px;
                  font-weight:700;
                "
              >
                ${APP_NAME}
              </h1>

              <p
                style="
                  margin:8px 0 0;
                  color:#ffffff;
                  opacity:.9;
                  font-size:14px;
                "
              >
                Verification Code
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">

              <h2
                style="
                  margin-top:0;
                  color:#111827;
                "
              >
                Hello 👋
              </h2>

              <p
                style="
                  font-size:15px;
                  color:#4b5563;
                  line-height:1.7;
                "
              >
                Use the verification code below to continue with your request.
                This code is valid for
                <strong>${expiry} minutes</strong>.
              </p>

              <div
                style="
                  text-align:center;
                  margin:40px 0;
                "
              >
                <span
                  style="
                    display:inline-block;
                    padding:18px 40px;
                    border-radius:12px;
                    background:#eff6ff;
                    color:${APP_PRIMARY_COLOR};
                    font-size:34px;
                    font-weight:bold;
                    letter-spacing:8px;
                  "
                >
                  ${otp}
                </span>
              </div>

              <p
                style="
                  font-size:14px;
                  color:#6b7280;
                  line-height:1.7;
                "
              >
                If you didn't request this code, you can safely ignore this
                email. No further action is required.
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td
              align="center"
              style="
                background:#f9fafb;
                padding:24px;
                border-top:1px solid #e5e7eb;
              "
            >

              ${
                APP_URL
                  ? `
                <a
                  href="${APP_URL}"
                  style="
                    color:${APP_PRIMARY_COLOR};
                    text-decoration:none;
                    font-size:14px;
                    font-weight:600;
                  "
                >
                  ${APP_URL}
                </a>

                <br><br>
              `
                  : ""
              }

              <span
                style="
                  color:#9ca3af;
                  font-size:13px;
                "
              >
                © ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.
              </span>

            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>

</html>
`,
});

export const sendOtpEmail = async (to, otp, expiry = 10) => {
  const template = emailOtp(otp, expiry);
  await sendEmail(to, template.subject, template.html);
};