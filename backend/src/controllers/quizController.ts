import { Request, Response, NextFunction } from 'express';
import { Quiz, QuizAttempt, Lesson, IUser } from '../models';

interface AuthRequest extends Request {
  user?: IUser;
}

export const getQuizByLessonId = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { lessonId } = req.params;
    
    // Verify lesson exists
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      res.status(404).json({ 
        success: false,
        error: 'Lesson not found' 
      });
      return;
    }

    const quiz = await Quiz.findOne({ lessonId })
      .populate('lessonId', 'title');

    if (!quiz) {
      res.status(404).json({ 
        success: false,
        error: 'No quiz found for this lesson' 
      });
      return;
    }

    res.json({
      success: true,
      data: quiz
    });
  } catch (error) {
    next(error);
  }
};

export const submitQuizAttempt = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { quizId } = req.params;
    const { answers } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      res.status(401).json({ 
        success: false,
        error: 'Authentication required' 
      });
      return;
    }

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      res.status(404).json({ 
        success: false,
        error: 'Quiz not found' 
      });
      return;
    }

    // Calculate score and prepare answers
    let correctAnswers = 0;
    const processedAnswers = answers.map((answer: any, index: number) => {
      const question = quiz.questions[index];
      const isCorrect = question.correctAnswer.toString() === answer.selectedAnswer;
      if (isCorrect) correctAnswers++;

      const pointsEarned = isCorrect ? (question.points || 10) : 0;

      return {
        questionId: question._id,
        userAnswer: answer.selectedAnswer,
        isCorrect,
        pointsEarned
      };
    });

    const score = Math.round((correctAnswers / quiz.questions.length) * 100);
    const passed = score >= quiz.passingScore;

    // Calculate total time spent
    const totalTimeSpent = answers.reduce((total: number, answer: any) => total + (answer.timeSpent || 0), 0);

    // Create quiz attempt
    const attempt = new QuizAttempt({
      userId,
      quizId,
      lessonId: quiz.lessonId,
      answers: processedAnswers,
      score,
      passed,
      timeSpent: totalTimeSpent
    });

    await attempt.save();

    // Update quiz statistics  
    const currentAverage = quiz.averageScore;
    const newAttemptCount = quiz.attemptsCount + 1;
    const newAverage = ((currentAverage * quiz.attemptsCount) + score) / newAttemptCount;

    await Quiz.findByIdAndUpdate(quizId, {
      $inc: { attemptsCount: 1 },
      $set: { averageScore: Math.round(newAverage) }
    });

    // Return results compatible with frontend expectations
    res.json({
      success: true,
      data: {
        _id: attempt._id,
        userId: attempt.userId,
        quizId: attempt.quizId,
        lessonId: attempt.lessonId,
        answers: processedAnswers,
        score,
        passed,
        completedAt: attempt.completedAt,
        timeSpent: totalTimeSpent,
        createdAt: attempt.createdAt,
        updatedAt: attempt.updatedAt
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getQuizAttempt = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { attemptId } = req.params;
    const userId = req.user?._id;

    if (!userId) {
      res.status(401).json({ 
        success: false,
        error: 'Authentication required' 
      });
      return;
    }

    const attempt = await QuizAttempt.findOne({ 
      _id: attemptId, 
      userId 
    })
    .populate('quizId')
    .populate('lessonId', 'title');

    if (!attempt) {
      res.status(404).json({ 
        success: false,
        error: 'Quiz attempt not found' 
      });
      return;
    }

    res.json({
      success: true,
      data: attempt
    });
  } catch (error) {
    next(error);
  }
};

export const getUserQuizHistory = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?._id;
    const { page = 1, limit = 10 } = req.query;

    if (!userId) {
      res.status(401).json({ 
        success: false,
        error: 'Authentication required' 
      });
      return;
    }

    const attempts = await QuizAttempt.find({ userId })
      .populate('lessonId', 'title')
      .populate({
        path: 'quizId',
        select: 'title passingScore'
      })
      .sort({ completedAt: -1 })
      .limit(Number(limit) * Number(page))
      .skip((Number(page) - 1) * Number(limit));

    const total = await QuizAttempt.countDocuments({ userId });

    // Calculate user quiz statistics
    const stats = await QuizAttempt.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: null,
          totalAttempts: { $sum: 1 },
          passedQuizzes: {
            $sum: { $cond: [{ $eq: ['$passed', true] }, 1, 0] }
          },
          averageScore: { $avg: '$score' },
          totalTimeSpent: { $sum: '$timeSpent' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        attempts,
        stats: stats[0] || { 
          totalAttempts: 0, 
          passedQuizzes: 0, 
          averageScore: 0, 
          totalTimeSpent: 0 
        },
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          pages: Math.ceil(total / Number(limit))
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getQuizStatsByLesson = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { lessonId } = req.params;
    const userId = req.user?._id;

    if (!userId) {
      res.status(401).json({ 
        success: false,
        error: 'Authentication required' 
      });
      return;
    }

    // Get user's attempts for this lesson's quiz
    const quiz = await Quiz.findOne({ lessonId });
    if (!quiz) {
      res.status(404).json({ 
        success: false,
        error: 'No quiz found for this lesson' 
      });
      return;
    }

    const attempts = await QuizAttempt.find({ 
      userId, 
      quizId: quiz._id 
    }).sort({ completedAt: -1 });

    const bestAttempt = attempts.length > 0 ? attempts.reduce((best, current) => {
      return (current.score > best.score) ? current : best;
    }) : null;

    res.json({
      success: true,
      data: {
        quizId: quiz._id,
        totalAttempts: attempts.length,
        bestScore: bestAttempt?.score || 0,
        lastAttempt: attempts[0] || null,
        hasPassed: bestAttempt?.passed || false,
        passingScore: quiz.passingScore
      }
    });
  } catch (error) {
    next(error);
  }
}; 

// --- ADMIN QUIZ CRUD ---

// List all quizzes (with lesson info)
export const adminListQuizzes = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const quizzes = await Quiz.find().populate('lessonId', 'title');
    res.json({ success: true, data: quizzes });
  } catch (error) {
    next(error);
  }
};

// Get a single quiz by ID
export const adminGetQuiz = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate('lessonId', 'title');
    if (!quiz) {
      res.status(404).json({ success: false, error: 'Quiz not found' });
      return;
    }
    res.json({ success: true, data: quiz });
  } catch (error) {
    next(error);
  }
};

// Create a new quiz
export const adminCreateQuiz = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const quiz = new Quiz(req.body);
    await quiz.save();
    res.status(201).json({ success: true, data: quiz });
  } catch (error) {
    next(error);
  }
};

// Update a quiz
export const adminUpdateQuiz = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!quiz) {
      res.status(404).json({ success: false, error: 'Quiz not found' });
      return;
    }
    res.json({ success: true, data: quiz });
  } catch (error) {
    next(error);
  }
};

// Delete a quiz
export const adminDeleteQuiz = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!quiz) {
      res.status(404).json({ success: false, error: 'Quiz not found' });
      return;
    }
    res.json({ success: true, message: 'Quiz deleted' });
  } catch (error) {
    next(error);
  }
}; 