import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUserPreferences {
  themes: string[];
  notificationsEnabled: boolean;
  notificationTime: string;
  language: string;
  timezone: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  cookieConsent?: {
    analytics: boolean;
    preferences: boolean;
    marketing: boolean;
  };
}

export interface ISubscriptionInfo {
  plan: 'free' | 'premium';
  status: 'active' | 'inactive' | 'canceled';
  startDate?: Date;
  endDate?: Date;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
}

export interface ILearningStats {
  currentStreak: number;
  longestStreak: number;
  totalLessonsCompleted: number;
  totalQuizzesCompleted: number;
  averageQuizScore: number;
  experiencePoints: number;
  level: number;
  lastActivityDate?: Date;
}

export interface IUser extends Document {
  email: string;
  password: string;
  username: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  preferences: IUserPreferences;
  subscription: ISubscriptionInfo;
  learningStats: ILearningStats;
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  lastLoginAt?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  hasCompletedCookieConsent: boolean;
  role: 'user' | 'admin';
  // Methods
  comparePassword(candidatePassword: string): Promise<boolean>;
  generatePasswordResetToken(): string;
}

const UserPreferencesSchema = new Schema<IUserPreferences>({
  themes: [{ type: String }],
  notificationsEnabled: { type: Boolean, default: true },
  notificationTime: { type: String, default: '09:00' },
  language: { type: String, default: 'en' },
  timezone: { type: String, default: 'UTC' },
  difficulty: { 
    type: String, 
    enum: ['beginner', 'intermediate', 'advanced'], 
    default: 'beginner' 
  },
  cookieConsent: {
    analytics: { type: Boolean, default: false },
    preferences: { type: Boolean, default: false },
    marketing: { type: Boolean, default: false },
  },
});

const SubscriptionInfoSchema = new Schema<ISubscriptionInfo>({
  plan: { type: String, enum: ['free', 'premium'], default: 'free' },
  status: { type: String, enum: ['active', 'inactive', 'canceled'], default: 'active' },
  startDate: { type: Date },
  endDate: { type: Date },
  stripeCustomerId: { type: String },
  stripeSubscriptionId: { type: String },
});

const LearningStatsSchema = new Schema<ILearningStats>({
  currentStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  totalLessonsCompleted: { type: Number, default: 0 },
  totalQuizzesCompleted: { type: Number, default: 0 },
  averageQuizScore: { type: Number, default: 0 },
  experiencePoints: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  lastActivityDate: { type: Date },
});

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false,
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [20, 'Username cannot exceed 20 characters'],
    match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'],
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    maxlength: [50, 'First name cannot exceed 50 characters'],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    maxlength: [50, 'Last name cannot exceed 50 characters'],
    trim: true,
  },
  avatar: {
    type: String,
  },
  preferences: {
    type: UserPreferencesSchema,
    default: () => ({}),
  },
  subscription: {
    type: SubscriptionInfoSchema,
    default: () => ({}),
  },
  learningStats: {
    type: LearningStatsSchema,
    default: () => ({}),
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  emailVerificationToken: {
    type: String,
  },
  passwordResetToken: {
    type: String,
  },
  passwordResetExpires: {
    type: Date,
  },
  lastLoginAt: {
    type: Date,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  hasCompletedCookieConsent: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
}, {
  timestamps: true,
});

// Indexes
UserSchema.index({ email: 1 });
UserSchema.index({ username: 1 });
UserSchema.index({ 'subscription.stripeCustomerId': 1 });

// Pre-save middleware to hash password
UserSchema.pre<IUser>('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Method to compare password
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to generate password reset token
UserSchema.methods.generatePasswordResetToken = function(): string {
  const resetToken = Math.random().toString(36).substring(2, 15) + 
                    Math.random().toString(36).substring(2, 15);
  
  this.passwordResetToken = resetToken;
  this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  
  return resetToken;
};

// Virtual for full name
UserSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Transform output
UserSchema.set('toJSON', {
  transform: function(_doc, ret) {
    delete (ret as any).password;
    delete (ret as any).passwordResetToken;
    delete (ret as any).passwordResetExpires;
    delete (ret as any).emailVerificationToken;
    return ret;
  }
});

export const User = mongoose.model<IUser>('User', UserSchema); 