import { Response, NextFunction } from 'express';
import { LessonProgress, QuizAttempt } from '../models';
import { AuthRequest } from '../middleware/auth';

// Get user dashboard data
export const getDashboard = async (
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
    
    // Get comprehensive learning statistics
    const [
      totalLessons,
      completedLessons,
      inProgressLessons,
      totalQuizzes,
      passedQuizzes,
      recentProgress,
      quizStats,
      timeStats
    ] = await Promise.all([
      LessonProgress.countDocuments({ userId }),
      LessonProgress.countDocuments({ userId, status: 'completed' }),
      LessonProgress.countDocuments({ userId, status: 'in_progress' }),
      QuizAttempt.countDocuments({ userId }),
      QuizAttempt.countDocuments({ userId, passed: true }),
      LessonProgress.find({ userId })
        .populate('lessonId', 'title themeId')
        .populate({
          path: 'lessonId',
          populate: { path: 'themeId', select: 'name color' }
        })
        .sort({ lastAccessedAt: -1 })
        .limit(5),
      
      // Comprehensive quiz statistics
      QuizAttempt.aggregate([
        { $match: { userId } },
        {
          $group: {
            _id: null,
            totalAttempts: { $sum: 1 },
            averageScore: { $avg: '$score' },
            passedQuizzes: {
              $sum: { $cond: ['$passed', 1, 0] }
            },
            totalTimeSpent: { $sum: '$timeSpent' },
            highestScore: { $max: '$score' },
            lowestScore: { $min: '$score' }
          }
        }
      ]),
      
      // Time statistics
      LessonProgress.aggregate([
        { $match: { userId } },
        {
          $group: {
            _id: null,
            totalTimeSpent: { $sum: '$timeSpent' }
          }
        }
      ])
    ]);
    
    // Calculate streak
    const streak = await calculateLearningStreak(userId);
    
    const totalTimeSpent = (timeStats[0]?.totalTimeSpent || 0) + (quizStats[0]?.totalTimeSpent || 0);
    const quizStatsData = quizStats[0] || {
      totalAttempts: 0,
      averageScore: 0,
      passedQuizzes: 0,
      totalTimeSpent: 0,
      highestScore: 0,
      lowestScore: 0
    };
    
    // Get achievements (mock for now)
    const achievements = [
      {
        id: 'first_lesson',
        name: 'Erste Lektion',
        description: 'Erste Lektion abgeschlossen',
        earned: completedLessons > 0,
        earnedAt: completedLessons > 0 ? new Date() : null
      },
      {
        id: 'quiz_master',
        name: 'Quiz-Meister',
        description: '5 Quizzes bestanden',
        earned: passedQuizzes >= 5,
        earnedAt: passedQuizzes >= 5 ? new Date() : null
      },
      {
        id: 'consistent_learner',
        name: 'Beständiger Lerner',
        description: '7 Tage-Streak erreicht',
        earned: streak >= 7,
        earnedAt: streak >= 7 ? new Date() : null
      },
      {
        id: 'quiz_perfection',
        name: 'Quiz-Perfektion',
        description: 'Ein Quiz mit 100% bestanden',
        earned: quizStatsData.highestScore >= 100,
        earnedAt: quizStatsData.highestScore >= 100 ? new Date() : null
      }
    ];
    
    res.json({
      success: true,
      data: {
        stats: {
          totalLessons,
          completedLessons,
          inProgressLessons,
          totalQuizzes,
          passedQuizzes,
          streak,
          totalTimeSpent,
          averageScore: Math.round(quizStatsData.averageScore || 0)
        },
        quizStatistics: {
          totalAttempts: quizStatsData.totalAttempts,
          averageScore: Math.round(quizStatsData.averageScore || 0),
          passedQuizzes: quizStatsData.passedQuizzes,
          quizTimeSpent: quizStatsData.totalTimeSpent,
          highestScore: quizStatsData.highestScore,
          lowestScore: quizStatsData.lowestScore || 0,
          passRate: quizStatsData.totalAttempts > 0 ? Math.round((quizStatsData.passedQuizzes / quizStatsData.totalAttempts) * 100) : 0
        },
        recentProgress,
        achievements
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get user statistics
export const getUserStats = async (
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
    
    // Get detailed learning statistics
    const [lessonStats, quizStats, timeStats] = await Promise.all([
      // Lesson statistics
      LessonProgress.aggregate([
        { $match: { userId } },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]),
      
      // Quiz statistics  
      QuizAttempt.aggregate([
        { $match: { userId } },
        {
          $group: {
            _id: null,
            totalAttempts: { $sum: 1 },
            averageScore: { $avg: '$score' },
            passedQuizzes: {
              $sum: { $cond: ['$passed', 1, 0] }
            }
          }
        }
      ]),
      
      // Time statistics by theme
      LessonProgress.aggregate([
        { $match: { userId } },
        {
          $lookup: {
            from: 'lessons',
            localField: 'lessonId',
            foreignField: '_id',
            as: 'lesson'
          }
        },
        { $unwind: '$lesson' },
        {
          $lookup: {
            from: 'themes',
            localField: 'lesson.themeId',
            foreignField: '_id',
            as: 'theme'
          }
        },
        { $unwind: '$theme' },
        {
          $group: {
            _id: '$theme.name',
            timeSpent: { $sum: '$timeSpent' },
            lessonsCompleted: {
              $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
            }
          }
        },
        { $sort: { timeSpent: -1 } }
      ])
    ]);
    
    // Format lesson statistics
    const formattedLessonStats = lessonStats.reduce((acc, stat) => {
      acc[stat._id] = stat.count;
      return acc;
    }, {});
    
    res.json({
      success: true,
      data: {
        lessonStats: {
          notStarted: formattedLessonStats.not_started || 0,
          inProgress: formattedLessonStats.in_progress || 0,
          completed: formattedLessonStats.completed || 0
        },
        quizStats: quizStats[0] || {
          totalAttempts: 0,
          averageScore: 0,
          passedQuizzes: 0
        },
        timeByTheme: timeStats
      }
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to calculate learning streak
async function calculateLearningStreak(userId: any): Promise<number> {
  try {
    // Get all lesson completions ordered by date
    const completions = await LessonProgress.find({
      userId,
      status: 'completed'
    }).sort({ completedAt: -1 });
    
    if (completions.length === 0) return 0;
    
    let streak = 1;
    let currentDate = new Date(completions[0].completedAt as Date);
    currentDate.setHours(0, 0, 0, 0);
    
    for (let i = 1; i < completions.length; i++) {
      const completionDate = new Date(completions[i].completedAt as Date);
      completionDate.setHours(0, 0, 0, 0);
      
      const dayDifference = Math.floor(
        (currentDate.getTime() - completionDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      
      if (dayDifference === 1) {
        streak++;
        currentDate = completionDate;
      } else if (dayDifference > 1) {
        break;
      }
    }
    
    return streak;
  } catch (error) {
    return 0;
  }
} 