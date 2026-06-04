process.env.JWT_SECRET = "test-secret";

const jwt = require("jsonwebtoken");

const authMiddleware = require("../src/middlewares/auth.middleware");

describe("authMiddleware", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      cookies: {},
    };

    res = {};

    next = jest.fn();
  });

  it("should reject requests without token", () => {
    authMiddleware(req, res, next);

    expect(next).toHaveBeenCalled();

    const error = next.mock.calls[0][0];

    expect(error.code).toBe("UNAUTHORIZED");
    expect(error.statusCode).toBe(401);
  });

  it("should reject invalid token", () => {
    req.cookies.token = "invalid-token";

    authMiddleware(req, res, next);

    const error = next.mock.calls[0][0];

    expect(error.code).toBe("INVALID_TOKEN");
    expect(error.statusCode).toBe(401);
  });

  it("should authenticate valid token", () => {
    const token = jwt.sign(
      {
        id: "123",
      },
      process.env.JWT_SECRET,
    );

    req.cookies.token = token;

    authMiddleware(req, res, next);

    expect(req.user.id).toBe("123");
    expect(next).toHaveBeenCalledWith();
  });
});
