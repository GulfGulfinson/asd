import { Router } from 'express';
import {
  getAllLessons,
  getLessonById,
  getTodaysLesson,
  likeLesson,
  updateProgress,
  getUserProgress,
  getLessonStats,
  shareLesson
} from '../controllers/lessonController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Protected routes (must come first to avoid route conflicts)
router.get('/today', authenticate, getTodaysLesson);
router.post('/:id/like', authenticate, likeLesson);
router.post('/:id/progress', authenticate, updateProgress);
router.get('/:id/progress', authenticate, getUserProgress);

// Public routes
router.get('/', getAllLessons);
router.get('/:id', getLessonById);
router.get('/:id/stats', getLessonStats);
router.post('/:id/share', shareLesson);

export default router; 