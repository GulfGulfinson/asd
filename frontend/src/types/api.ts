// User types
export interface User {
  _id: string;
  username: string;
  email: string;
  fullName: string;
  role: 'user' | 'admin';
  subscription: 'free' | 'premium';
  preferences: {
    language: string;
    theme: 'light' | 'dark';
    notifications: boolean;
    emailUpdates: boolean;
    cookieConsent?: {
      analytics: boolean;
      preferences: boolean;
      marketing: boolean;
    };
  };
  isEmailVerified: boolean;
  lastLoginAt: Date;
  createdAt: Date;
  updatedAt: Date;
  hasCompletedCookieConsent: boolean;
}

// Theme types
export interface Theme {
  _id: string;
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

// Lesson types
export interface Lesson {
  _id: string;
  title: string;
  content: string;
  summary: string;
  imageUrl?: string;
  audioUrl?: string;
  videoUrl?: string;
  themeId: Theme | string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedReadTime: number;
  tags: string[];
  isPublished: boolean;
  publishedAt?: Date;
  viewsCount: number;
  createdAt: Date;
  updatedAt: Date;
  
  // User-specific progress data (only present if authenticated)
  userProgress?: {
    status: 'not_started' | 'in_progress' | 'completed';
    readingProgress: number;
    completedAt?: Date;
    timeSpent: number;
  };
  
  // Quiz information (only present if authenticated and lesson has quiz)
  quiz?: {
    _id: string;
    title: string;
    passingScore: number;
    questionsCount: number;
  };
  
  // Last quiz attempt (only present if authenticated and user attempted quiz)
  lastQuizAttempt?: {
    _id: string;
    score: number;
    passed: boolean;
    completedAt: Date;
  };
  
  // Computed fields (only present if authenticated)
  hasQuiz?: boolean;
  lessonCompleted?: boolean;
  quizPassed?: boolean;
  quizAttempted?: boolean;
}

// Quiz types
export interface QuizQuestion {
  question: string;
  type: 'multiple-choice' | 'true-false' | 'fill-in-the-blank';
  options?: string[];
  correctAnswer: string;
  explanation?: string;
}

export interface Quiz {
  _id: string;
  lessonId: string;
  title: string;
  questions: QuizQuestion[];
  passingScore: number;
  timeLimit?: number;
  attemptsCount: number;
  averageScore: number;
  createdAt: Date;
  updatedAt: Date;
}

// Progress types
export interface LessonProgress {
  _id: string;
  userId: string;
  lessonId: string;
  status: 'not_started' | 'in_progress' | 'completed';
  readingProgress: number;
  completedAt?: Date;
  lastAccessedAt: Date;
  timeSpent: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface QuizAttempt {
  _id: string;
  userId: string;
  quizId: string;
  lessonId: string;
  answers: Array<{
    questionIndex: number;
    answer: string;
    isCorrect: boolean;
  }>;
  score: number;
  passed: boolean;
  completedAt: Date;
  timeSpent: number;
  createdAt: Date;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<{
  items: T[];
  pagination: {
    current: number;
    pages: number;
    total: number;
    limit: number;
  };
}> {}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  fullName: string;
  password: string;
}

export interface AuthResponse extends ApiResponse<{
  user: User;
  token: string;
  refreshToken: string;
}> {} 