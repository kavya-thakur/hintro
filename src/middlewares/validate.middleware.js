const AppError = require("../utils/AppError");

function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return next(
        new AppError(result.error.issues[0].message, 400, "VALIDATION_ERROR"),
      );
    }

    req.body = result.data;

    next();
  };
}

module.exports = validate;
