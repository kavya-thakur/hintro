const logger = require("../utils/logger");

function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;

  logger.error({
    traceId: req.traceId,
    method: req.method,
    path: req.originalUrl,
    statusCode,
    code: err.code || "INTERNAL_SERVER_ERROR",
    message: err.message || "Internal Server Error",
    stack: err.stack,
  });

  return res.status(statusCode).json({
    traceId: req.traceId,

    success: false,

    error: {
      code: err.code || "INTERNAL_SERVER_ERROR",

      message: statusCode === 500 ? "Internal Server Error" : err.message,
    },
  });
}

module.exports = errorHandler;
