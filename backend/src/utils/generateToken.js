const jwt = require("jsonwebtoken");

const generateToken = (userId, role, dbName) => {
  return jwt.sign(
    { id: userId, role, dbName },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

module.exports = generateToken;
