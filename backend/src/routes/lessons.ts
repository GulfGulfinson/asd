import { Router } from 'express';
import {
  getAllLessons,
  getLessonById,
  updateProgress,
  likeLesson
} from '../controllers/lessonController';
import { authenticate, optionalAuth } from '../middleware/auth';

const router = Router();

// Public routes (with optional auth for progress)
router.get('/', getAllLessons);
router.get('/:id', optionalAuth, getLessonById);

// Protected routes
router.put('/:id/progress', authenticate, updateProgress);
router.post('/:id/like', authenticate, likeLesson);

// Admin routes - placeholder for future implementation
// router.post('/', authenticate, authorize, createLesson);
// router.put('/:id', authenticate, authorize, updateLesson);
// router.delete('/:id', authenticate, authorize, deleteLesson);

export default router; 