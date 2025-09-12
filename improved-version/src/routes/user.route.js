import express from 'express';
import {
  createUserController,
  signinUser,
  getUserProfile,
  logoutUser,
  updateUserProfile
} from '../controllers/user.controller.js';
import { authenticateToken } from '../middlewares/auth.js';

const router = express.Router();

// Public routes (no authentication required)
router.post('/register', createUserController);  // POST /api/users/register
router.post('/login', signinUser);              // POST /api/users/login

// Protected routes (authentication required)
router.get('/profile', authenticateToken, getUserProfile);      // GET /api/users/profile
router.put('/profile', authenticateToken, updateUserProfile);   // PUT /api/users/profile
router.post('/logout', authenticateToken, logoutUser);          // POST /api/users/logout

export default router;