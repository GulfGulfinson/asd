import { Router } from 'express';
import {
  getAllLessons,
  getLessonById,
  getTodaysLesson,
  likeLesson,
  updateProgress,
  getUserProgress
} from '../controllers/lessonController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Protected routes (must come first to avoid route conflicts)
router.get('/today', authenticate, getTodaysLesson);

// Public routes
router.get('/', getAllLessons);

// Parameterized routes (must come after specific routes)
router.get('/:id', getLessonById);
router.get('/:id/progress', authenticate, getUserProgress);
router.post('/:id/like', authenticate, likeLesson);
router.put('/:id/progress', authenticate, updateProgress);

export default router; 