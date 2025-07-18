import mongoose, { Document, Schema } from 'mongoose';

export interface IQuizQuestion {
  _id: mongoose.Types.ObjectId;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'fill-in-the-blank';
  options?: string[];
  correctAnswer: string | number;
  explanation?: string;
  points: number;
}

export interface IQuiz extends Document {
  lessonId: mongoose.Types.ObjectId;
  title: string;
  questions: IQuizQuestion[];
  passingScore: number;
  timeLimit?: number;
  attemptsCount: number;
  averageScore: number;
  createdAt: Date;
  updatedAt: Date;
}

const QuizQuestionSchema = new Schema<IQuizQuestion>({
  question: {
    type: String,
    required: [true, 'Question is required'],
    trim: true,
  },
  type: {
    type: String,
    enum: ['multiple-choice', 'true-false', 'fill-in-the-blank'],
    required: [true, 'Question type is required'],
  },
  options: [{
    type: String,
    trim: true,
  }],
  correctAnswer: {
    type: Schema.Types.Mixed,
    required: [true, 'Correct answer is required'],
  },
  explanation: {
    type: String,
    trim: true,
  },
  points: {
    type: Number,
    required: false,
  },
});

const QuizSchema = new Schema<IQuiz>({
  lessonId: {
    type: Schema.Types.ObjectId,
    ref: 'Lesson',
    required: [true, 'Lesson is required'],
    unique: true,
  },
  title: {
    type: String,
    required: [true, 'Quiz title is required'],
    maxlength: [200, 'Quiz title cannot exceed 200 characters'],
    trim: true,
  },
  questions: {
    type: [QuizQuestionSchema],
    required: [true, 'At least one question is required'],
    validate: {
      validator: function(questions: IQuizQuestion[]) {
        return questions.length > 0;
      },
      message: 'Quiz must have at least one question',
    },
  },
  passingScore: {
    type: Number,
    required: [true, 'Passing score is required'],
    min: [0, 'Passing score must be at least 0'],
    max: [100, 'Passing score cannot exceed 100'],
  },
  timeLimit: {
    type: Number,
    min: [1, 'Time limit must be at least 1 minute'],
  },
  attemptsCount: {
    type: Number,
    default: 0,
  },
  averageScore: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// Indexes
QuizSchema.index({ lessonId: 1 });

// Validation for multiple choice questions
QuizQuestionSchema.pre('validate', function(next) {
  if (this.type === 'multiple-choice' && (!this.options || this.options.length < 2)) {
    next(new Error('Multiple choice questions must have at least 2 options'));
  } else if (this.type === 'true-false' && this.options && this.options.length !== 2) {
    next(new Error('True/false questions must have exactly 2 options'));
  } else {
    next();
  }
});

export const Quiz = mongoose.model<IQuiz>('Quiz', QuizSchema); 