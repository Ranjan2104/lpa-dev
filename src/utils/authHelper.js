require("dotenv").config();
const { createSecretToken } = require("../tokenGeneration/generateToken");
const jwt = require("jsonwebtoken");
const { errorHandler } = require("../utils/responseHandler");
const User = require("../models/user.model");

const createAuthResponse = async (user, res) => {
  const token = createSecretToken(user.id, user.role);
  const refreshToken = jwt.sign(
    { _id: user._id, role: user.role },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "7d",
    }
  );

  await User.updateOne({ _id: user._id }, { authToken: token });

  // Set tokens in cookies
  res.cookie("authToken", token, {
    httpOnly: true,
    maxAge: 25 * 24 * 60 * 60 * 1000, // 25 days in milliseconds
    secure: process.env.NODE_ENV === "production",
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    secure: process.env.NODE_ENV === "production",
  });

  res.setHeader("Authorization", `Bearer ${token}`);

  return {
    token,
    refreshToken,
    user: {
      _id: user.id,
      mobileNo: user.mobileNo,
      email: user.email,
      role: user.role,
    },
  };
};

const verifyToken = async (req, res, next) => {
  try {
    const token =
      req.cookies?.authToken || req.headers?.authorization?.split(" ")[1];

    if (!token) {
      return errorHandler({
        res,
        statusCode: 401,
        message: "Unauthorized: Token not provided",
      });
    }

    const decoded = await new Promise((resolve, reject) => {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) return reject(err);
        resolve(decoded);
      });
    });

    req.user = decoded;

    const user = await User.findOne({
      _id: req.user._id,
      authToken: token,
      isActive: true,
    });

    if (!user) {
      return errorHandler({
        res,
        statusCode: 403,
        message: "Unauthorized: Invalid or inactive user",
      });
    }

    next();
  } catch (error) {
    return errorHandler({
      res,
      statusCode: 403,
      message: error.message || "Unauthorized",
    });
  }
};

module.exports = {
  createAuthResponse,
  verifyToken,
};
