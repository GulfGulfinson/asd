import mongoose, { Document, Schema } from 'mongoose';

export interface ILesson extends Document {
  title: string;
  content: string;
  summary: string;
  imageUrl?: string;
  audioUrl?: string;
  videoUrl?: string;
  themeId: mongoose.Types.ObjectId;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedReadTime: number;
  tags: string[];
  isPublished: boolean;
  publishedAt?: Date;
  viewsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const LessonSchema = new Schema<ILesson>({
  title: {
    type: String,
    required: [true, 'Lesson title is required'],
    maxlength: [200, 'Lesson title cannot exceed 200 characters'],
    trim: true,
  },
  content: {
    type: String,
    required: [true, 'Lesson content is required'],
  },
  summary: {
    type: String,
    required: [true, 'Lesson summary is required'],
    maxlength: [500, 'Lesson summary cannot exceed 500 characters'],
    trim: true,
  },
  imageUrl: {
    type: String,
  },
  audioUrl: {
    type: String,
  },
  videoUrl: {
    type: String,
  },
  themeId: {
    type: Schema.Types.ObjectId,
    ref: 'Theme',
    required: [true, 'Theme is required'],
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: [true, 'Difficulty level is required'],
  },
  estimatedReadTime: {
    type: Number,
    required: [true, 'Estimated read time is required'],
    min: [1, 'Estimated read time must be at least 1 minute'],
  },
  tags: [{
    type: String,
    trim: true,
  }],
  isPublished: {
    type: Boolean,
    default: false,
  },
  publishedAt: {
    type: Date,
  },
  viewsCount: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// Indexes
LessonSchema.index({ themeId: 1, isPublished: 1 });
LessonSchema.index({ difficulty: 1, isPublished: 1 });
LessonSchema.index({ tags: 1 });
LessonSchema.index({ publishedAt: -1 });

// Pre-save middleware to set published date
LessonSchema.pre<ILesson>('save', function(next) {
  if (this.isModified('isPublished') && this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

// Pre-save middleware to calculate estimated read time
LessonSchema.pre<ILesson>('save', function(next) {
  if (this.isModified('content')) {
    const wordsPerMinute = 200;
    const wordCount = this.content.split(/\s+/).length;
    this.estimatedReadTime = Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  }
  next();
});

export const Lesson = mongoose.model<ILesson>('Lesson', LessonSchema); 