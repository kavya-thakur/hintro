const jwt = require("jsonwebtoken");

const AppError = require("../utils/AppError");

function authMiddleware(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return next(new AppError("Authentication required", 401, "UNAUTHORIZED"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch {
    return next(new AppError("Invalid or expired token", 401, "INVALID_TOKEN"));
  }
}

module.exports = authMiddleware;
