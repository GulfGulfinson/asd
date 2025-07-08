import { Router } from 'express';
import authRoutes from './authRoutes';
import lessonRoutes from './lessonRoutes';
import themeRoutes from './themeRoutes';
import quizRoutes from './quizRoutes';
import userRoutes from './userRoutes';

const router = Router();

// API Routes
router.use('/auth', authRoutes);
router.use('/lessons', lessonRoutes);
router.use('/themes', themeRoutes);
router.use('/quizzes', quizRoutes);
router.use('/users', userRoutes);

// Health check endpoint
router.get('/health', (_req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'DailyLearn API'
  });
});

export default router; 