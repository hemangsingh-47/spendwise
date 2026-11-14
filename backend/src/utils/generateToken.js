const jwt = require('jsonwebtoken');

/**
 * Generates a signed JSON Web Token (JWT) with user ID as verified subject
 * @param {string|ObjectId} userId
 * @returns {string} JWT Token
 */
const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET || 'fallback_development_jwt_secret_2026';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

  return jwt.sign({ id: userId }, secret, {
    expiresIn,
  });
};

module.exports = generateToken;

