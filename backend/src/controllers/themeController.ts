import { Request, Response, NextFunction } from 'express';
import { Theme, Lesson } from '../models';

// Get all themes with lesson counts
export const getAllThemes = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { includeInactive = false } = req.query;
    
    // Build query
    let query: any = {};
    if (!includeInactive) {
      query.isActive = true;
    }
    
    // Get themes with lesson counts using aggregation
    const themes = await Theme.aggregate([
      { $match: query },
      {
        $lookup: {
          from: 'lessons',
          localField: '_id',
          foreignField: 'themeId',
          as: 'lessons'
        }
      },
      {
        $addFields: {
          lessonsCount: { $size: '$lessons' }
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          slug: 1,
          color: 1,
          icon: 1,
          isActive: 1,
          createdAt: 1,
          updatedAt: 1,
          lessonsCount: 1
        }
      },
      { $sort: { name: 1 } }
    ]);
    
    res.json({
      success: true,
      data: {
        themes,
        total: themes.length
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get theme by ID with lesson count
export const getThemeById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    
    const themes = await Theme.aggregate([
      { $match: { _id: id } },
      {
        $lookup: {
          from: 'lessons',
          localField: '_id',
          foreignField: 'themeId',
          as: 'lessons'
        }
      },
      {
        $addFields: {
          lessonsCount: { $size: '$lessons' }
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          slug: 1,
          color: 1,
          icon: 1,
          isActive: 1,
          createdAt: 1,
          updatedAt: 1,
          lessonsCount: 1
        }
      }
    ]);
    
    if (!themes || themes.length === 0) {
      res.status(404).json({
        success: false,
        error: 'Theme not found'
      });
      return;
    }
    
    res.json({
      success: true,
      data: themes[0]
    });
  } catch (error) {
    next(error);
  }
};

// Get lessons for a specific theme
export const getThemeLessons = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10, difficulty, search } = req.query;
    
    const pageNum = Math.max(1, parseInt(page as string, 10));
    const limitNum = Math.max(1, Math.min(50, parseInt(limit as string, 10)));
    const skip = (pageNum - 1) * limitNum;
    
    // Check if theme exists
    const theme = await Theme.findById(id);
    if (!theme) {
      res.status(404).json({
        success: false,
        error: 'Theme not found'
      });
      return;
    }
    
    // Build query for lessons
    let query: any = { themeId: id, isPublished: true };
    
    if (difficulty) {
      query.difficulty = difficulty;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { summary: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search as string, 'i')] } }
      ];
    }
    
    // Get lessons with pagination
    const [lessons, total] = await Promise.all([
      Lesson.find(query)
        .populate('themeId', 'name color icon')
        .sort({ publishedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Lesson.countDocuments(query)
    ]);
    
    const pages = Math.ceil(total / limitNum);
    
    res.json({
      success: true,
      data: {
        theme,
        lessons,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get theme statistics
export const getThemeStats = async (
  _req: Request, // Remove unused warning by renaming to _req
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const stats = await Theme.aggregate([
      {
        $lookup: {
          from: 'lessons',
          localField: '_id',
          foreignField: 'themeId',
          as: 'lessons'
        }
      },
      {
        $group: {
          _id: null,
          totalThemes: { $sum: 1 },
          activeThemes: {
            $sum: { $cond: ['$isActive', 1, 0] }
          },
          totalLessons: {
            $sum: { $size: '$lessons' }
          },
          averageLessonsPerTheme: {
            $avg: { $size: '$lessons' }
          }
        }
      }
    ]);
    
    const result = stats[0] || {
      totalThemes: 0,
      activeThemes: 0,
      totalLessons: 0,
      averageLessonsPerTheme: 0
    };
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
}; 