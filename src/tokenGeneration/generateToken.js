require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports.createSecretToken = (_id, role) => {
  return jwt.sign({ _id, role }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: 3 * 24 * 60 * 60,
  });
};
