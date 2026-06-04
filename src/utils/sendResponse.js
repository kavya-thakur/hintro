function sendResponse(req, res, statusCode, data = {}) {
  return res.status(statusCode).json({
    traceId: req.traceId,
    success: true,
    data,
  });
}

module.exports = sendResponse;
