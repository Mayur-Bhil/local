import jwt from 'jsonwebtoken';
import User from '../model/user.model.js';

export const authenticateToken = async (req, res, next) => {
  try {
    let token = null;

    // Method 1: Check Authorization header (Bearer token)
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7); // Remove 'Bearer ' prefix
    }
    
    // Method 2: Check cookies (fallback)
    if (!token && req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    // Method 3: Check other possible header formats
    if (!token && req.headers['x-auth-token']) {
      token = req.headers['x-auth-token'];
    }

    // Debug: Log what we received
    console.log('Auth Debug Info:');
    console.log('Authorization header:', authHeader);
    console.log('Cookies:', req.cookies);
    console.log('Token extracted:', token ? 'Token found' : 'No token');

    if (!token) {
      return res.status(401).json({
        message: 'Access token is required',
        success: false,
        debug: {
          authHeader: !!authHeader,
          cookies: !!req.cookies,
          receivedHeaders: Object.keys(req.headers)
        }
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decoded:', decoded);
    
    // Check if user still exists
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        message: 'Invalid token - user not found',
        success: false,
      });
    }

    // Add user info to request
    req.userId = decoded.userId;
    req.user = user;
    
    console.log('Authentication successful for user:', user.email);
    next();

  } catch (error) {
    console.log('Authentication Error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({
        message: 'Invalid token format',
        success: false,
        error: error.message
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({
        message: 'Token has expired',
        success: false,
      });
    }
    
    return res.status(500).json({
      message: 'Authentication failed',
      success: false,
      error: error.message
    });
  }
};