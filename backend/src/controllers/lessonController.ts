import { Request, Response, NextFunction } from 'express';
import { Lesson, LessonProgress, IUser } from '../models';

interface AuthRequest extends Request {
  user?: IUser;
}

// Get all lessons with filtering, pagination, and quiz completion status
export const getAllLessons = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { 
      page = 1, 
      limit = 12, 
      themeId, 
      difficulty, 
      search,
      status, // new: filter by completion status
      quizStatus // new: filter by quiz completion status (passed, failed, not_attempted)
    } = req.query;
    
    const pageNum = Math.max(1, parseInt(page as string, 10));
    const limitNum = Math.max(1, Math.min(50, parseInt(limit as string, 10)));
    const skip = (pageNum - 1) * limitNum;
    
    // Build query
    const query: any = { isPublished: true };
    
    if (themeId) {
      query.themeId = themeId;
    }
    
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
    
    // Get user ID if authenticated
    const userId = (req as any).user?._id;
    
    // Base aggregation pipeline
    let pipeline: any[] = [
      { $match: query },
      {
        $lookup: {
          from: 'themes',
          localField: 'themeId',
          foreignField: '_id',
          as: 'theme'
        }
      },
      { $unwind: { path: '$theme', preserveNullAndEmptyArrays: true } }
    ];
    
    // Add user progress data if authenticated
    if (userId) {
      pipeline.push(
        {
          $lookup: {
            from: 'lessonprogresses',
            let: { lessonId: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$lessonId', '$$lessonId'] },
                      { $eq: ['$userId', userId] }
                    ]
                  }
                }
              }
            ],
            as: 'userProgress'
          }
        },
        {
          $lookup: {
            from: 'quizzes',
            localField: '_id',
            foreignField: 'lessonId',
            as: 'quiz'
          }
        },
        {
          $lookup: {
            from: 'quizattempts',
            let: { lessonId: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$lessonId', '$$lessonId'] },
                      { $eq: ['$userId', userId] }
                    ]
                  }
                }
              },
              { $sort: { completedAt: -1 } },
              { $limit: 1 }
            ],
            as: 'lastQuizAttempt'
          }
        }
      );
    }
    
    // Add computed fields
    pipeline.push({
      $addFields: {
        userProgress: { $arrayElemAt: ['$userProgress', 0] },
        quiz: { $arrayElemAt: ['$quiz', 0] },
        lastQuizAttempt: { $arrayElemAt: ['$lastQuizAttempt', 0] },
        hasQuiz: { $gt: [{ $size: { $ifNull: ['$quiz', []] } }, 0] },
        lessonCompleted: {
          $cond: {
            if: { $eq: [{ $arrayElemAt: ['$userProgress.status', 0] }, 'completed'] },
            then: true,
            else: false
          }
        },
        quizPassed: {
          $cond: {
            if: { $eq: [{ $arrayElemAt: ['$lastQuizAttempt.passed', 0] }, true] },
            then: true,
            else: false
          }
        },
        quizAttempted: {
          $cond: {
            if: { $gt: [{ $size: { $ifNull: ['$lastQuizAttempt', []] } }, 0] },
            then: true,
            else: false
          }
        }
      }
    });
    
    // Apply status filters if provided and user is authenticated
    if (userId && status) {
      const statusFilter: any = {};
      switch (status) {
        case 'completed':
          statusFilter.lessonCompleted = true;
          break;
        case 'in_progress':
          statusFilter['userProgress.status'] = 'in_progress';
          break;
        case 'not_started':
          statusFilter.$or = [
            { userProgress: { $exists: false } },
            { 'userProgress.status': 'not_started' }
          ];
          break;
      }
      pipeline.push({ $match: statusFilter });
    }
    
    // Apply quiz status filters if provided and user is authenticated
    if (userId && quizStatus) {
      const quizFilter: any = {};
      switch (quizStatus) {
        case 'passed':
          quizFilter.quizPassed = true;
          break;
        case 'failed':
          quizFilter.$and = [
            { quizAttempted: true },
            { quizPassed: false }
          ];
          break;
        case 'not_attempted':
          quizFilter.$and = [
            { hasQuiz: true },
            { quizAttempted: false }
          ];
          break;
        case 'no_quiz':
          quizFilter.hasQuiz = false;
          break;
      }
      pipeline.push({ $match: quizFilter });
    }
    
    // Sort by publication date (newest first)
    pipeline.push({ $sort: { publishedAt: -1, createdAt: -1 } });
    
    // Get total count for pagination
    const countPipeline = [...pipeline, { $count: 'total' }];
    const [countResult] = await Lesson.aggregate(countPipeline);
    const total = countResult?.total || 0;
    
    // Add pagination
    pipeline.push({ $skip: skip }, { $limit: limitNum });
    
    // Project final fields
    pipeline.push({
      $project: {
        _id: 1,
        title: 1,
        summary: 1,
        imageUrl: 1,
        themeId: 1,
        difficulty: 1,
        estimatedReadTime: 1,
        tags: 1,
        viewsCount: 1,
        publishedAt: 1,
        createdAt: 1,
        updatedAt: 1,
        theme: 1,
        // User-specific data (only if authenticated)
        ...(userId && {
          userProgress: {
            status: '$userProgress.status',
            readingProgress: '$userProgress.readingProgress',
            completedAt: '$userProgress.completedAt',
            timeSpent: '$userProgress.timeSpent'
          },
          quiz: {
            _id: '$quiz._id',
            title: '$quiz.title',
            passingScore: '$quiz.passingScore',
            questionsCount: { $size: { $ifNull: ['$quiz.questions', []] } }
          },
          lastQuizAttempt: {
            _id: '$lastQuizAttempt._id',
            score: '$lastQuizAttempt.score',
            passed: '$lastQuizAttempt.passed',
            completedAt: '$lastQuizAttempt.completedAt'
          },
          hasQuiz: 1,
          lessonCompleted: 1,
          quizPassed: 1,
          quizAttempted: 1
        })
      }
    });
    
    // Execute aggregation
    const lessons = await Lesson.aggregate(pipeline);
    
    const pages = Math.ceil(total / limitNum);
    
    res.json({
      success: true,
      data: {
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

// Get single lesson by ID
export const getLessonById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    console.log(`[getLessonById] called for lesson id: ${id} at ${new Date().toISOString()}`);
    const userId = (req as any).user?._id; // Get user ID if authenticated
    
    const lesson = await Lesson.findById(id)
      .populate('themeId', 'name color icon slug');
    
    if (!lesson) {
      res.status(404).json({
        success: false,
        error: 'Lesson not found'
      });
      return;
    }

    // Increment view count
    lesson.viewsCount = (lesson.viewsCount || 0) + 1;
    await lesson.save();

    // If user is authenticated, create or update lesson progress
    let userProgress = null;
    if (userId) {
      userProgress = await LessonProgress.findOne({ userId, lessonId: id });
      
      if (!userProgress) {
        // Create new progress entry with 'in_progress' status
        userProgress = new LessonProgress({
          userId,
          lessonId: id,
          status: 'in_progress',
          readingProgress: 0,
          timeSpent: 0,
          lastAccessedAt: new Date()
        });
      } else {
        // Update last accessed time and set status to in_progress if not completed
        userProgress.lastAccessedAt = new Date();
        if (userProgress.status === 'not_started') {
          userProgress.status = 'in_progress';
        }
      }
      
      await userProgress.save();
    }

    res.json({
      success: true,
      data: {
        lesson,
        userProgress: userProgress ? {
          status: userProgress.status,
          readingProgress: userProgress.readingProgress,
          completedAt: userProgress.completedAt,
          timeSpent: userProgress.timeSpent
        } : null
      }
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
    
    const normalizedProgress = Math.min(100, Math.max(0, readingProgress || 0));
    const isCompleted = normalizedProgress >= 100;
    
    // Prepare update data
    const updateData: any = {
      readingProgress: normalizedProgress,
      timeSpent: Math.max(0, timeSpent || 0),
      lastAccessedAt: new Date()
    };
    
    // If progress reaches 100%, mark as completed
    if (isCompleted) {
      updateData.status = 'completed';
      updateData.completedAt = new Date();
    } else if (normalizedProgress > 0) {
      // If progress > 0 but < 100, mark as in_progress
      updateData.status = 'in_progress';
    }
    
    // Find or create lesson progress
    let progress = await LessonProgress.findOneAndUpdate(
      { userId, lessonId: id },
      { $set: updateData },
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

// Get popular/featured lessons for home page
export const getPopularLessons = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { limit = 6 } = req.query;
    const limitNum = Math.max(1, Math.min(20, parseInt(limit as string, 10)));
    
    // Get popular lessons based on views, likes, and recent activity
    const pipeline: any[] = [
      { $match: { isPublished: true } },
      {
        $lookup: {
          from: 'themes',
          localField: 'themeId',
          foreignField: '_id',
          as: 'theme'
        }
      },
      { $unwind: { path: '$theme', preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          popularityScore: {
            $add: [
              { $multiply: ['$viewsCount', 0.3] },
              // Boost recent lessons
              {
                $cond: {
                  if: {
                    $gte: [
                      '$publishedAt',
                      { $subtract: [new Date(), 30 * 24 * 60 * 60 * 1000] } // Last 30 days
                    ]
                  },
                  then: 50,
                  else: 0
                }
              }
            ]
          }
        }
      },
      { $sort: { popularityScore: -1, publishedAt: -1 } },
      { $limit: limitNum },
      {
        $project: {
          _id: 1,
          title: 1,
          summary: 1,
          imageUrl: 1,
          difficulty: 1,
          estimatedReadTime: 1,
          tags: 1,
          viewsCount: 1,
          publishedAt: 1,
          theme: {
            _id: '$theme._id',
            name: '$theme.name',
            color: '$theme.color',
            icon: '$theme.icon'
          }
        }
      }
    ];
    
    const popularLessons = await Lesson.aggregate(pipeline);
    
    res.json({
      success: true,
      data: {
        lessons: popularLessons,
        total: popularLessons.length
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get featured lessons by theme for home page
export const getFeaturedLessons = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { themeId, limit = 3 } = req.query;
    const limitNum = Math.max(1, Math.min(10, parseInt(limit as string, 10)));
    
    let matchQuery: any = { isPublished: true };
    if (themeId) {
      matchQuery.themeId = themeId;
    }
    
    const pipeline: any[] = [
      { $match: matchQuery },
      {
        $lookup: {
          from: 'themes',
          localField: 'themeId',
          foreignField: '_id',
          as: 'theme'
        }
      },
      { $unwind: { path: '$theme', preserveNullAndEmptyArrays: true } },
      { $sort: { likesCount: -1, viewsCount: -1, publishedAt: -1 } },
      { $limit: limitNum },
      {
        $project: {
          _id: 1,
          title: 1,
          summary: 1,
          imageUrl: 1,
          difficulty: 1,
          estimatedReadTime: 1,
          viewsCount: 1,
          likesCount: 1,
          theme: {
            _id: '$theme._id',
            name: '$theme.name',
            color: '$theme.color',
            icon: '$theme.icon'
          }
        }
      }
    ];
    
    const featuredLessons = await Lesson.aggregate(pipeline);
    
    res.json({
      success: true,
      data: {
        lessons: featuredLessons,
        theme: themeId
      }
    });
  } catch (error) {
    next(error);
  }
}; 