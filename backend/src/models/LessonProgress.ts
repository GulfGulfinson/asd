import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ILessonProgress extends Document {
  userId: Types.ObjectId;
  lessonId: Types.ObjectId;
  status: 'not_started' | 'in_progress' | 'completed';
  readingProgress: number; // 0-100
  completedAt?: Date;
  lastAccessedAt: Date;
  timeSpent: number; // in seconds
}

const LessonProgressSchema = new Schema<ILessonProgress>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  lessonId: {
    type: Schema.Types.ObjectId,
    ref: 'Lesson',
    required: true,
  },
  status: {
    type: String,
    enum: ['not_started', 'in_progress', 'completed'],
    default: 'not_started',
  },
  readingProgress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  completedAt: Date,
  lastAccessedAt: {
    type: Date,
    default: Date.now,
  },
  timeSpent: {
    type: Number,
    default: 0,
    min: 0,
  },
}, {
  timestamps: true,
});

// Indexes
LessonProgressSchema.index({ userId: 1, lessonId: 1 }, { unique: true });
LessonProgressSchema.index({ userId: 1, status: 1 });
LessonProgressSchema.index({ userId: 1, lastAccessedAt: -1 });

// Pre-save middleware to set completion date
LessonProgressSchema.pre<ILessonProgress>('save', function(next) {
  if (this.isModified('status') && this.status === 'completed' && !this.completedAt) {
    this.completedAt = new Date();
  }
  
  if (this.isModified('readingProgress') && this.readingProgress >= 100) {
    this.status = 'completed';
    if (!this.completedAt) {
      this.completedAt = new Date();
    }
  }
  
  next();
});

export const LessonProgress = mongoose.model<ILessonProgress>('LessonProgress', LessonProgressSchema); 