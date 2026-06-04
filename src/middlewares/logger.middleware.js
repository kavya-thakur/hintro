const logger = require("../utils/logger");

function loggerMiddleware(req, res, next) {
  const start = Date.now();

  res.on("finish", () => {
    logger.info({
      traceId: req.traceId,

      method: req.method,

      path: req.originalUrl,

      statusCode: res.statusCode,

      duration: Date.now() - start + "ms",
    });
  });

  next();
}

module.exports = loggerMiddleware;
