const colors = {
  reset: "\x1b[0m",
  info: "\x1b[36m",
  success: "\x1b[32m",
  warn: "\x1b[33m",
  error: "\x1b[31m",
  timestamp: "\x1b[90m",
};

type LogLevel = "info" | "success" | "warn" | "error";

const formatMessage = (level: LogLevel, message: string) => {
  const timestamp = new Date().toISOString();

  return `${colors.timestamp}[${timestamp}]${colors.reset} ${
    colors[level]
  }[${level.toUpperCase()}]${colors.reset} ${message}`;
};

const print = (
  level: LogLevel,
  message: string,
  ...meta: unknown[]
) => {
  const formatted = formatMessage(level, message);

  switch (level) {
    case "warn":
      // eslint-disable-next-line no-console
      console.warn(formatted, ...meta);
      break;

    case "error":
      // eslint-disable-next-line no-console
      console.error(formatted, ...meta);
      break;

    default:
      // eslint-disable-next-line no-console
      console.log(formatted, ...meta);
  }
};

export const logger = {
  info: (message: string, ...meta: unknown[]) =>
    print("info", message, ...meta),

  success: (message: string, ...meta: unknown[]) =>
    print("success", message, ...meta),

  warn: (message: string, ...meta: unknown[]) =>
    print("warn", message, ...meta),

  error: (message: string, ...meta: unknown[]) =>
    print("error", message, ...meta),
};

export default logger;