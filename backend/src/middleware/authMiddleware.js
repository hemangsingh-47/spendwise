const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Authentication Middleware
 * Protects private REST API endpoints by verifying incoming Bearer JWT tokens.
 * Attaches the verified user document (excluding password) to req.user.
 */
const protect = async (req, res, next) => {
  let token;

  // 1. Inspect Authorization Header for 'Bearer <token>'
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract token string after 'Bearer '
      token = req.headers.authorization.split(' ')[1];

      // 2. Verify token signature with JWT_SECRET
      const secret = process.env.JWT_SECRET || 'fallback_development_jwt_secret_2026';
      const decoded = jwt.verify(token, secret);

      // 3. Find user by verified ID payload, strictly omitting password
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized, user profile not found',
        });
      }

      // Proceed to the next middleware or controller
      return next();
    } catch (error) {
      console.error(`[Auth-Middleware] Token Verification Failed: ${error.message}`);
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token is invalid or has expired',
      });
    }
  }

  // If no token was found in the header
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no bearer token provided',
    });
  }
};

module.exports = { protect };

