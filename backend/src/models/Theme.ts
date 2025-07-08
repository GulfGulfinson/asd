import mongoose, { Document, Schema } from 'mongoose';

export interface ITheme extends Document {
  name: string;
  description: string;
  slug: string;
  color: string;
  icon: string;
  isActive: boolean;
  lessonsCount: number;
  subscribersCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const ThemeSchema = new Schema<ITheme>({
  name: {
    type: String,
    required: [true, 'Theme name is required'],
    unique: true,
    maxlength: [100, 'Theme name cannot exceed 100 characters'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Theme description is required'],
    maxlength: [500, 'Theme description cannot exceed 500 characters'],
    trim: true,
  },
  slug: {
    type: String,
    required: [true, 'Theme slug is required'],
    unique: true,
    lowercase: true,
    match: [/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'],
  },
  color: {
    type: String,
    required: [true, 'Theme color is required'],
    match: [/^#[0-9A-F]{6}$/i, 'Color must be a valid hex color'],
  },
  icon: {
    type: String,
    required: [true, 'Theme icon is required'],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  lessonsCount: {
    type: Number,
    default: 0,
  },
  subscribersCount: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// Indexes
ThemeSchema.index({ slug: 1 });
ThemeSchema.index({ isActive: 1 });

// Pre-save middleware to generate slug
ThemeSchema.pre<ITheme>('save', function(next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  next();
});

export const Theme = mongoose.model<ITheme>('Theme', ThemeSchema); 