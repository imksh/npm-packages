const colors = {
  reset: "\x1b[0m",
  info: "\x1b[36m", // Cyan
  success: "\x1b[32m", // Green
  warn: "\x1b[33m", // Yellow
  error: "\x1b[31m", // Red
  timestamp: "\x1b[90m", // Gray
};

const formatMessage = (level, message) => {
  const timestamp = new Date().toISOString();
  return `${colors.timestamp}[${timestamp}]${colors.reset} ${colors[level] || colors.reset}[${level.toUpperCase()}]${colors.reset} ${message}`;
};

export const logger = {
  info: (msg) => console.log(formatMessage("info", msg)),
  success: (msg) => console.log(formatMessage("success", msg)),
  warn: (msg) => console.warn(formatMessage("warn", msg)),
  error: (msg, err) => {
    console.error(formatMessage("error", msg));
    if (err) console.error(err);
  },
};

export default logger;
