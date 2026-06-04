class AppError extends Error {
  constructor(message, statusCode, code = "INTERNAL_ERROR") {
    super(message);

    this.statusCode = statusCode;
    this.code = code;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
