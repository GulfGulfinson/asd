import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { Lesson } from '../models';
import { 
  adminListQuizzes, 
  adminGetQuiz, 
  adminCreateQuiz, 
  adminUpdateQuiz, 
  adminDeleteQuiz 
} from '../controllers/quizController';

const router = Router();

// Minimal admin dashboard endpoint
router.get('/dashboard', authenticate, authorize('admin'), (_req, res) => {
  res.json({
    success: true,
    message: 'Welcome to the Admin Dashboard!',
    // Room for more extensive admin data in the future
  });
});

// Admin: List all lessons
router.get('/lessons', authenticate, authorize('admin'), async (_req, res, next) => {
  try {
    const lessons = await Lesson.find().populate('themeId', 'name color');
    res.json({ success: true, data: lessons });
  } catch (error) {
    next(error);
  }
});

// Admin: Create lesson
router.post('/lessons', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const lesson = new Lesson(req.body);
    await lesson.save();
    res.status(201).json({ success: true, data: lesson });
  } catch (error) {
    next(error);
  }
});

// Admin: Update lesson
router.put('/lessons/:id', authenticate, authorize('admin'), async (req, res, next): Promise<void> => {
  try {
    const lesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!lesson) {
      res.status(404).json({ success: false, error: 'Lesson not found' });
      return;
    }
    res.json({ success: true, data: lesson });
  } catch (error) {
    next(error);
  }
});

// Admin: Delete lesson
router.delete('/lessons/:id', authenticate, authorize('admin'), async (req, res, next): Promise<void> => {
  try {
    const lesson = await Lesson.findByIdAndDelete(req.params.id);
    if (!lesson) {
      res.status(404).json({ success: false, error: 'Lesson not found' });
      return;
    }
    res.json({ success: true, message: 'Lesson deleted' });
  } catch (error) {
    next(error);
  }
});

// --- ADMIN QUIZ CRUD ---
router.get('/quizzes', authenticate, authorize('admin'), adminListQuizzes);
router.get('/quizzes/:id', authenticate, authorize('admin'), adminGetQuiz);
router.post('/quizzes', authenticate, authorize('admin'), adminCreateQuiz);
router.put('/quizzes/:id', authenticate, authorize('admin'), adminUpdateQuiz);
router.delete('/quizzes/:id', authenticate, authorize('admin'), adminDeleteQuiz);

// Placeholders for themes management
router.get('/themes', authenticate, authorize('admin'), (_req, res) => {
  res.json({ success: true, message: 'List of themes (admin only)' });
});

export default router; 