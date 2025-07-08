import { Request, Response, NextFunction } from 'express';
import { Lesson, LessonProgress, IUser } from '../models';

interface AuthRequest extends Request {
  user?: IUser;
}

// Get all lessons with optional filtering
export const getAllLessons = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { themeId, difficulty, search, page = 1, limit = 10 } = req.query;
    
    const filter: any = { isPublished: true };
    
    if (themeId) filter.themeId = themeId;
    if (difficulty) filter.difficulty = difficulty;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { summary: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search as string, 'i')] } }
      ];
    }
    
    const skip = (Number(page) - 1) * Number(limit);
    
    const [lessons, total] = await Promise.all([
      Lesson.find(filter)
        .populate('themeId', 'name color icon')
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Lesson.countDocuments(filter)
    ]);
    
    res.json({
      success: true,
      data: {
        lessons,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get lesson by ID
export const getLessonById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    
    const lesson = await Lesson.findById(id).populate('themeId', 'name color icon');
    
    if (!lesson) {
      res.status(404).json({
        success: false,
        error: 'Lesson not found'
      });
      return;
    }
    
    // Increment view count
    lesson.viewsCount += 1;
    await lesson.save();
    
    res.json({
      success: true,
      data: lesson
    });
  } catch (error) {
    next(error);
  }
};

// Get today's lesson for authenticated user
export const getTodaysLesson = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?._id;
    
    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'User not authenticated'
      });
      return;
    }
    
    // Get user's preferred themes
    const userThemes = req.user?.preferences?.themes || [];
    
    // Find a lesson the user hasn't completed yet
    const completedLessons = await LessonProgress.find({
      userId,
      status: 'completed'
    }).select('lessonId');
    
    const completedLessonIds = completedLessons.map(progress => progress.lessonId);
    
    const filter: any = {
      isPublished: true,
      _id: { $nin: completedLessonIds }
    };
    
    if (userThemes.length > 0) {
      filter.themeId = { $in: userThemes };
    }
    
    const lesson = await Lesson.findOne(filter)
      .populate('themeId', 'name color icon')
      .sort({ publishedAt: 1 });
    
    if (!lesson) {
      res.status(404).json({
        success: false,
        error: 'No new lessons available'
      });
      return;
    }
    
    res.json({
      success: true,
      data: lesson
    });
  } catch (error) {
    next(error);
  }
};

// Like/unlike a lesson
export const likeLesson = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;
    
    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'User not authenticated'
      });
      return;
    }
    
    const lesson = await Lesson.findById(id);
    
    if (!lesson) {
      res.status(404).json({
        success: false,
        error: 'Lesson not found'
      });
      return;
    }
    
    // Find or create lesson progress
    let progress = await LessonProgress.findOne({ userId, lessonId: id });
    
    if (!progress) {
      progress = new LessonProgress({
        userId,
        lessonId: id,
        status: 'not_started',
        readingProgress: 0,
        liked: true,
        timeSpent: 0
      });
    } else {
      progress.liked = !progress.liked;
    }
    
    await progress.save();
    
    // Update lesson like count
    const likeCount = await LessonProgress.countDocuments({
      lessonId: id,
      liked: true
    });
    
    lesson.likesCount = likeCount;
    await lesson.save();
    
    res.json({
      success: true,
      data: {
        liked: progress.liked,
        likesCount: lesson.likesCount
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update lesson progress
export const updateProgress = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { readingProgress, timeSpent } = req.body;
    const userId = req.user?._id;
    
    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'User not authenticated'
      });
      return;
    }
    
    const lesson = await Lesson.findById(id);
    
    if (!lesson) {
      res.status(404).json({
        success: false,
        error: 'Lesson not found'
      });
      return;
    }
    
    // Find or create lesson progress
    let progress = await LessonProgress.findOneAndUpdate(
      { userId, lessonId: id },
      {
        $set: {
          readingProgress: Math.min(100, Math.max(0, readingProgress || 0)),
          timeSpent: Math.max(0, timeSpent || 0),
          lastAccessedAt: new Date()
        }
      },
      { upsert: true, new: true }
    );
    
    res.json({
      success: true,
      data: progress
    });
  } catch (error) {
    next(error);
  }
};

// Get user's progress for a lesson
export const getUserProgress = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;
    
    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'User not authenticated'
      });
      return;
    }
    
    const progress = await LessonProgress.findOne({ userId, lessonId: id });
    
    res.json({
      success: true,
      data: progress || {
        status: 'not_started',
        readingProgress: 0,
        liked: false,
        timeSpent: 0
      }
    });
  } catch (error) {
    next(error);
  }
}; 