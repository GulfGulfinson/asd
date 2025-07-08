import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { getDashboard, getUserStats } from '../controllers/userController';

const router = Router();

// Protected routes for user management
router.get('/dashboard', authenticate, getDashboard);
router.get('/stats', authenticate, getUserStats);

export default router; 