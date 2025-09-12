import jwt from 'jsonwebtoken';
import User from '../model/user.model.js';

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        message: 'Access token is required',
        success: false,
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verify user still exists
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        message: 'Invalid token - user not found',
        success: false,
      });
    }

    req.userId = decoded.userId;
    req.user = user;
    next();
  } catch (error) {
    console.log('Auth Error:', error);
    return res.status(403).json({
      message: 'Invalid or expired token',
      success: false,
    });
  }
};