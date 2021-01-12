const jwt = require("jsonwebtoken");
const process = require("process");

const generateToken = (data) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      data,
      process.env.JWT_SECRET || "secret",
      {
        expiresIn: process.env.JWT_EXPIRATION || 60000,
        algorithm: process.env.JWT_ALGORITHM || "HS512",
      },
      (error, token) => {
        if (error) {
          reject("Token failed to be generated");
        } else {
          resolve(token);
        }
      }
    );
  });
};
module.exports = generateToken;
