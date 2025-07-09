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

// Get lesson statistics
export const getLessonStats = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    
    const lesson = await Lesson.findById(id);
    
    if (!lesson) {
      res.status(404).json({
        success: false,
        error: 'Lesson not found'
      });
      return;
    }
    
    // Get detailed statistics
    const [
      uniqueViewers,
      completedUsers,
      totalLikes,
      averageTimeSpent,
      difficultyStats
    ] = await Promise.all([
      // Count unique users who viewed this lesson
      LessonProgress.distinct('userId', { lessonId: id }),
      
      // Count users who completed this lesson
      LessonProgress.countDocuments({ 
        lessonId: id, 
        status: 'completed' 
      }),
      
      // Count total likes
      LessonProgress.countDocuments({ 
        lessonId: id, 
        liked: true 
      }),
      
      // Calculate average time spent
      LessonProgress.aggregate([
        { $match: { lessonId: lesson._id, timeSpent: { $gt: 0 } } },
        {
          $group: {
            _id: null,
            averageTime: { $avg: '$timeSpent' },
            totalTime: { $sum: '$timeSpent' }
          }
        }
      ]),
      
      // Get completion rate by difficulty preference
      LessonProgress.aggregate([
        { $match: { lessonId: lesson._id } },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'user'
          }
        },
        { $unwind: '$user' },
        {
          $group: {
            _id: '$user.preferences.difficulty',
            completed: {
              $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
            },
            total: { $sum: 1 }
          }
        }
      ])
    ]);
    
    const uniqueViewersCount = uniqueViewers.length;
    const completionRate = uniqueViewersCount > 0 ? (completedUsers / uniqueViewersCount) * 100 : 0;
    const timeStats = averageTimeSpent[0] || { averageTime: 0, totalTime: 0 };
    
    res.json({
      success: true,
      data: {
        viewsCount: lesson.viewsCount,
        uniqueViewers: uniqueViewersCount,
        likesCount: totalLikes,
        completedUsers,
        completionRate: Math.round(completionRate * 100) / 100,
        averageTimeSpent: Math.round(timeStats.averageTime || 0),
        totalTimeSpent: timeStats.totalTime || 0,
        difficultyBreakdown: difficultyStats,
        lastUpdated: new Date()
      }
    });
  } catch (error) {
    next(error);
  }
};

// Share lesson (track sharing statistics)
export const shareLesson = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    // Note: platform and method could be used for analytics in the future
    // const { platform, method } = req.body; // e.g., platform: 'social', method: 'link'
    
    const lesson = await Lesson.findById(id);
    
    if (!lesson) {
      res.status(404).json({
        success: false,
        error: 'Lesson not found'
      });
      return;
    }
    
    // Log sharing event (you could create a separate ShareEvent model if needed)
    // For now, we'll just return success and sharing data
    
    const shareData = {
      url: `${process.env.FRONTEND_URL}/lessons/${id}`,
      title: lesson.title,
      description: lesson.summary,
      image: lesson.imageUrl
    };
    
    res.json({
      success: true,
      data: shareData,
      message: 'Lesson shared successfully'
    });
  } catch (error) {
    next(error);
  }
}; 