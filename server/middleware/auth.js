const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Check for token in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ error: 'User not found' });
      }

      // Update last seen
      await req.user.updateLastSeen();

      next();
    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(401).json({ error: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ error: 'Not authorized, no token' });
  }
};

// Optional auth middleware (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
  try {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      
      if (req.user) {
        await req.user.updateLastSeen();
      }
    }
  } catch (error) {
    // Silently fail for optional auth
    console.log('Optional auth failed:', error.message);
  }
  next();
};

// Role-based authorization middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authorized' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    next();
  };
};

// Rate limiting per user
const userRateLimit = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
  const userRequests = new Map();

  return (req, res, next) => {
    if (!req.user) {
      return next();
    }

    const userId = req.user._id.toString();
    const now = Date.now();
    const userData = userRequests.get(userId) || { count: 0, resetTime: now + windowMs };

    // Reset counter if window has passed
    if (now > userData.resetTime) {
      userData.count = 0;
      userData.resetTime = now + windowMs;
    }

    // Check if user has exceeded limit
    if (userData.count >= maxRequests) {
      return res.status(429).json({
        error: 'Rate limit exceeded',
        message: `Too many requests. Please try again in ${Math.ceil((userData.resetTime - now) / 1000)} seconds.`
      });
    }

    // Increment counter
    userData.count++;
    userRequests.get(userId) || userRequests.set(userId, userData);

    next();
  };
};

// Clean up expired rate limit data periodically
setInterval(() => {
  const now = Date.now();
  for (const [userId, userData] of userRequests.entries()) {
    if (now > userData.resetTime) {
      userRequests.delete(userId);
    }
  }
}, 60 * 1000); // Clean up every minute

module.exports = {
  protect,
  optionalAuth,
  authorize,
  userRateLimit
};
