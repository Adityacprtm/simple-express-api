const jwt = require("jsonwebtoken");

const generateToken = (data) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      data,
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRATION,
        algorithm: process.env.JWT_ALGORITHM,
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
