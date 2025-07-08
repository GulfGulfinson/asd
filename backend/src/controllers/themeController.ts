import { Request, Response, NextFunction } from 'express';
import { Theme } from '../models';

// Get all themes
export const getAllThemes = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { includeInactive = false } = req.query;
    
    const filter: any = {};
    if (!includeInactive) {
      filter.isActive = true;
    }
    
    const themes = await Theme.find(filter).sort({ name: 1 });
    
    res.json({
      success: true,
      data: themes
    });
  } catch (error) {
    next(error);
  }
};

// Get theme by slug
export const getThemeBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { slug } = req.params;
    
    const theme = await Theme.findOne({ slug, isActive: true });
    
    if (!theme) {
      res.status(404).json({
        success: false,
        error: 'Theme not found'
      });
      return;
    }
    
    res.json({
      success: true,
      data: theme
    });
  } catch (error) {
    next(error);
  }
};

// Get themes with statistics
export const getThemesWithStats = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const themes = await Theme.aggregate([
      { $match: { isActive: true } },
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
          lessonsCount: { $size: '$lessons' },
          publishedLessonsCount: {
            $size: {
              $filter: {
                input: '$lessons',
                cond: { $eq: ['$$this.isPublished', true] }
              }
            }
          }
        }
      },
      {
        $project: {
          lessons: 0
        }
      },
      { $sort: { name: 1 } }
    ]);
    
    res.json({
      success: true,
      data: themes
    });
  } catch (error) {
    next(error);
  }
}; 