import { Router } from 'express';
import {
  getQuizByLessonId,
  submitQuizAttempt,
  getQuizAttempt,
  getUserQuizHistory,
  getQuizStatsByLesson
} from '../controllers/quizController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Protected routes
router.get('/lesson/:lessonId', getQuizByLessonId);
router.post('/:quizId/attempt', authenticate, submitQuizAttempt);
router.get('/attempt/:attemptId', authenticate, getQuizAttempt);
router.get('/my/history', authenticate, getUserQuizHistory);
router.get('/lesson/:lessonId/stats', authenticate, getQuizStatsByLesson);

export default router; 