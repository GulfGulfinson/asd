import { Router } from 'express';
import { 
  register, 
  login, 
  getProfile, 
  updateProfile, 
  updatePreferences, 
  changePassword 
} from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { validateRegistration, validateLogin } from '../middleware/validation';

const router = Router();

// Public routes
router.post('/register', validateRegistration, register);
router.post('/login', validateLogin, login);

// Protected routes
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);
router.put('/preferences', authenticate, updatePreferences);
router.put('/change-password', authenticate, changePassword);

export default router; 