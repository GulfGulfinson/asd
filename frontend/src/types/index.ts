// User Types
export interface User {
  _id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'admin';
  isEmailVerified: boolean;
  preferences: UserPreferences;
  subscription: Subscription;
  learningStats: LearningStats;
  lastLoginAt?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  themes: string[];
  notificationsEnabled: boolean;
  notificationTime: string;
  language: string;
  timezone: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface Subscription {
  plan: 'free' | 'premium';
  status: 'active' | 'inactive' | 'cancelled';
  startDate?: Date;
  endDate?: Date;
}

export interface LearningStats {
  currentStreak: number;
  longestStreak: number;
  totalLessonsCompleted: number;
  totalQuizzesCompleted: number;
  averageQuizScore: number;
  experiencePoints: number;
  level: number;
  lastActivityDate?: Date;
}

// Theme Types
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

// Lesson Types
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
  likesCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface LessonProgress {
  _id: string;
  userId: string;
  lessonId: string;
  isCompleted: boolean;
  completedAt?: Date;
  timeSpent: number;
  isLiked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Quiz Types
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

export interface QuizQuestion {
  _id?: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  points: number;
}

export interface QuizAttempt {
  _id: string;
  userId: string;
  quizId: string;
  answers: QuizAnswer[];
  score: number;
  passed: boolean;
  timeSpent: number;
  completedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface QuizAnswer {
  questionId: string;
  selectedOption: number;
  isCorrect: boolean;
  points: number;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
    refreshToken: string;
  };
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    items: T[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
  };
}

// Dashboard Types
export interface DashboardData {
  currentStreak: number;
  totalLessonsCompleted: number;
  totalQuizzesCompleted: number;
  averageQuizScore: number;
  recentLessons: Lesson[];
  recommendedLessons: Lesson[];
  progressByTheme: ThemeProgress[];
  weeklyActivity: ActivityData[];
}

export interface ThemeProgress {
  theme: Theme;
  completedLessons: number;
  totalLessons: number;
  averageScore: number;
}

export interface ActivityData {
  date: string;
  lessonsCompleted: number;
  quizzesCompleted: number;
  timeSpent: number;
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
  username: string;
  firstName: string;
  lastName: string;
}

export interface ProfileForm {
  firstName: string;
  lastName: string;
  preferences: UserPreferences;
}

// UI State Types
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface UIState {
  loading: boolean;
  error: string | null;
  success: string | null;
}

export interface AuthState extends UIState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
}

export interface ThemeState extends UIState {
  themes: Theme[];
  selectedTheme: Theme | null;
}

export interface LessonState extends UIState {
  lessons: Lesson[];
  currentLesson: Lesson | null;
  selectedLesson: Lesson | null;
  dailyLesson: Lesson | null;
  progress: LessonProgress[];
  pagination: Pagination;
}

export interface QuizState extends UIState {
  currentQuiz: Quiz | null;
  attempts: QuizAttempt[];
  currentAttempt: QuizAttempt | null;
} 