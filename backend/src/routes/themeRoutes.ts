import { Router } from 'express';
import {
  getAllThemes,
  getThemeBySlug,
  getThemesWithStats
} from '../controllers/themeController';

const router = Router();

// Public routes
router.get('/', getAllThemes);
router.get('/stats', getThemesWithStats);
router.get('/:slug', getThemeBySlug);

export default router; 