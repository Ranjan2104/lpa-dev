const crypto = require("crypto");

// Configurations for PBKDF2
const iterations = 100000;
const keyLength = 64;
const digest = "sha512";

// Helper function to hash a password
const hashPassword = (password, salt) => {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(
      password,
      salt,
      iterations,
      keyLength,
      digest,
      (err, derivedKey) => {
        if (err) reject(err);
        resolve(derivedKey.toString("hex"));
      }
    );
  });
};

// Helper function to compare passwords
const comparePassword = async (inputPassword, storedHash, salt) => {
  const hashedInput = await hashPassword(inputPassword, salt);
  return hashedInput === storedHash;
};

module.exports = { hashPassword, comparePassword };
