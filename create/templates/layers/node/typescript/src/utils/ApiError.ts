export class ApiError extends Error {
  public statusCode: number;
  public data: unknown;
  public success: boolean;
  public errors: unknown[];

  constructor(
    statusCode: number,
    message: string = "Something went wrong",
    errors: unknown[] = [],
    stack: string = "",
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else if (typeof (Error as unknown as { captureStackTrace?: (target: object, constructor: unknown) => void }).captureStackTrace === "function") {
      (Error as unknown as { captureStackTrace: (target: object, constructor: unknown) => void }).captureStackTrace(this, this.constructor);
    }
  }
}
