import { Router } from 'express';
import { 
  getAllThemes, 
  getThemeById, 
  getThemeLessons,
  getThemeStats
} from '../controllers/themeController';

const router = Router();

// Public routes
router.get('/', getAllThemes);
router.get('/stats', getThemeStats);
router.get('/:id', getThemeById);
router.get('/:id/lessons', getThemeLessons);

export default router; 