const colors = {
  reset: "\x1b[0m",
  info: "\x1b[36m", // Cyan
  success: "\x1b[32m", // Green
  warn: "\x1b[33m", // Yellow
  error: "\x1b[31m", // Red
  timestamp: "\x1b[90m", // Gray
};

type LogLevel = "info" | "success" | "warn" | "error";

const formatMessage = (level: LogLevel, message: string) => {
  const timestamp = new Date().toISOString();
  return `${colors.timestamp}[${timestamp}]${colors.reset} ${colors[level] || colors.reset}[${level.toUpperCase()}]${colors.reset} ${message}`;
};

export const logger = {
  info: (msg: string) => console.log(formatMessage("info", msg)),
  success: (msg: string) => console.log(formatMessage("success", msg)),
  warn: (msg: string) => console.warn(formatMessage("warn", msg)),
  error: (msg: string, err?: any) => {
    console.error(formatMessage("error", msg));
    if (err) console.error(err);
  },
};

export default logger;
