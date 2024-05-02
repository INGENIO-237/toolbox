export class BaseError extends Error {
  constructor(
    name: string,
    message: string,
    public statusCode: number,
    public isOperationalError: boolean
  ) {
    super(message);
    this.name = name;
    this.statusCode = statusCode;
    this.isOperationalError = isOperationalError;

    Error.captureStackTrace(this);
  }
}

class ApiError extends BaseError {
  constructor(message: string, statusCode: number) {
    super("ApiError", message, statusCode, true);
  }
}

export default ApiError;
