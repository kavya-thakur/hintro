const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const AppError = require("../utils/AppError");
const sendResponse = require("../utils/sendResponse");

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const generateToken = (userId) => {
  return jwt.sign(
    {
      id: userId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );
};

const registerUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError(
      "Email and password are required",
      400,
      "VALIDATION_ERROR",
    );
  }

  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await userModel.findOne({
    email: normalizedEmail,
  });

  if (existingUser) {
    throw new AppError(
      "User already exists with this email",
      409,
      "USER_ALREADY_EXISTS",
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    email: normalizedEmail,
    password: hashedPassword,
  });

  const token = generateToken(user._id);

  res.cookie("token", token, COOKIE_OPTIONS);

  return sendResponse(req, res, 201, {
    user: {
      id: user._id,
      email: user.email,
    },
  });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError(
      "Email and password are required",
      400,
      "VALIDATION_ERROR",
    );
  }

  const normalizedEmail = email.trim().toLowerCase();

  const user = await userModel.findOne({
    email: normalizedEmail,
  });

  if (!user) {
    throw new AppError("Invalid email or password", 401, "INVALID_CREDENTIALS");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", 401, "INVALID_CREDENTIALS");
  }

  const token = generateToken(user._id);

  res.cookie("token", token, COOKIE_OPTIONS);

  return sendResponse(req, res, 200, {
    message: "Login successful",
    user: {
      id: user._id,
      email: user.email,
    },
  });
});

const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  return sendResponse(req, res, 200, {
    message: "Logout successful",
  });
});

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
};
