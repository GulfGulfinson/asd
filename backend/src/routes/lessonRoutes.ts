import { Router } from 'express';
import {
  getAllLessons,
  getLessonById,
  getTodaysLesson,
  updateProgress,
  getUserProgress,
  getLessonStats,
  shareLesson,
  getPopularLessons,
  getFeaturedLessons
} from '../controllers/lessonController';
import { authenticate, optionalAuth } from '../middleware/auth';

const router = Router();

// Public routes with optional auth for progress tracking
router.get('/', optionalAuth, getAllLessons);
router.get('/popular', getPopularLessons);
router.get('/featured', getFeaturedLessons);
router.get('/today', authenticate, getTodaysLesson);
router.get('/:id', optionalAuth, getLessonById);
router.get('/:id/stats', getLessonStats);

// Protected routes
router.post('/:id/share', authenticate, shareLesson);
router.put('/:id/progress', authenticate, updateProgress);
router.get('/:id/progress', authenticate, getUserProgress);

export default router; 