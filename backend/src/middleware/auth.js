const jwt = require('jsonwebtoken');

/**
 * Middleware to verify JWT token and attach user info to request
 * Token must be in Authorization header: Bearer <token>
 */
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided. Use Authorization: Bearer <token>' });
    }

    const token = authHeader.slice(7); // Remove "Bearer " prefix

    if (!token) {
      return res.status(401).json({ error: 'Invalid token format' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key_here');
    
    // Attach user ID to request object for use in route handlers
    req.userId = decoded.user.id;
    req.user = decoded.user;

    console.log(`[AUTH] User ${req.userId} authenticated successfully`);
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired. Please login again.' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    console.error('[AUTH_ERROR]', error.message);
    return res.status(401).json({ error: 'Authentication failed' });
  }
};

module.exports = authMiddleware;
