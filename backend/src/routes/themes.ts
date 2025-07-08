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

// Admin routes - placeholder for future implementation
// router.post('/', authenticate, authorize, createTheme);
// router.put('/:id', authenticate, authorize, updateTheme);
// router.delete('/:id', authenticate, authorize, deleteTheme);

export default router; 