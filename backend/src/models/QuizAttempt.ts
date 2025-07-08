import mongoose, { Document, Schema } from 'mongoose';

export interface IQuizAnswer {
  questionId: mongoose.Types.ObjectId;
  userAnswer: string | number;
  isCorrect: boolean;
  pointsEarned: number;
}

export interface IQuizAttempt extends Document {
  userId: mongoose.Types.ObjectId;
  quizId: mongoose.Types.ObjectId;
  lessonId: mongoose.Types.ObjectId;
  answers: IQuizAnswer[];
  score: number;
  passed: boolean;
  completedAt: Date;
  timeSpent: number;
  createdAt: Date;
  updatedAt: Date;
}

const QuizAnswerSchema = new Schema<IQuizAnswer>({
  questionId: {
    type: Schema.Types.ObjectId,
    required: [true, 'Question ID is required'],
  },
  userAnswer: {
    type: Schema.Types.Mixed,
    required: [true, 'User answer is required'],
  },
  isCorrect: {
    type: Boolean,
    required: [true, 'Correct status is required'],
  },
  pointsEarned: {
    type: Number,
    required: [true, 'Points earned is required'],
    min: [0, 'Points earned cannot be negative'],
  },
});

const QuizAttemptSchema = new Schema<IQuizAttempt>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required'],
  },
  quizId: {
    type: Schema.Types.ObjectId,
    ref: 'Quiz',
    required: [true, 'Quiz is required'],
  },
  lessonId: {
    type: Schema.Types.ObjectId,
    ref: 'Lesson',
    required: [true, 'Lesson is required'],
  },
  answers: {
    type: [QuizAnswerSchema],
    required: [true, 'Answers are required'],
  },
  score: {
    type: Number,
    required: [true, 'Score is required'],
    min: [0, 'Score cannot be negative'],
    max: [100, 'Score cannot exceed 100'],
  },
  passed: {
    type: Boolean,
    required: [true, 'Passed status is required'],
  },
  completedAt: {
    type: Date,
    default: Date.now,
  },
  timeSpent: {
    type: Number,
    required: [true, 'Time spent is required'],
    min: [0, 'Time spent cannot be negative'],
  },
}, {
  timestamps: true,
});

// Indexes
QuizAttemptSchema.index({ userId: 1, quizId: 1 });
QuizAttemptSchema.index({ userId: 1, completedAt: -1 });
QuizAttemptSchema.index({ lessonId: 1, userId: 1 });

export const QuizAttempt = mongoose.model<IQuizAttempt>('QuizAttempt', QuizAttemptSchema); 