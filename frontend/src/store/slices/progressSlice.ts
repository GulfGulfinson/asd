import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Types
export interface LessonProgress {
  lessonId: string;
  completed: boolean;
  completedAt?: Date;
  timeSpent: number; // in seconds
  quizScore?: number;
  quizPassed?: boolean;
  quizAttempts: number;
}

export interface DailyStreak {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: Date | null;
  streakStartDate: Date | null;
}

export interface UserStats {
  totalLessonsCompleted: number;
  totalQuizzesPassed: number;
  totalTimeSpent: number; // in seconds
  averageQuizScore: number;
  totalPoints: number;
  currentLevel: number;
  pointsToNextLevel: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  category: 'streak' | 'completion' | 'quiz' | 'time' | 'special';
}

export interface ProgressState {
  lessonProgress: Record<string, LessonProgress>;
  dailyStreak: DailyStreak;
  userStats: UserStats;
  achievements: Achievement[];
  todayCompleted: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: ProgressState = {
  lessonProgress: {},
  dailyStreak: {
    currentStreak: 0,
    longestStreak: 0,
    lastActivityDate: null,
    streakStartDate: null,
  },
  userStats: {
    totalLessonsCompleted: 0,
    totalQuizzesPassed: 0,
    totalTimeSpent: 0,
    averageQuizScore: 0,
    totalPoints: 0,
    currentLevel: 1,
    pointsToNextLevel: 100,
  },
  achievements: [],
  todayCompleted: false,
  loading: false,
  error: null,
};

// Mock achievements data
const AVAILABLE_ACHIEVEMENTS = [
  {
    id: 'first_lesson',
    name: 'Erste Schritte',
    description: 'Erste Lektion abgeschlossen',
    icon: '🌟',
    category: 'completion' as const,
  },
  {
    id: 'streak_3',
    name: '3 Tage am Stück',
    description: '3 Tage in Folge gelernt',
    icon: '🔥',
    category: 'streak' as const,
  },
  {
    id: 'streak_7',
    name: 'Eine Woche stark',
    description: '7 Tage in Folge gelernt',
    icon: '💪',
    category: 'streak' as const,
  },
  {
    id: 'quiz_master',
    name: 'Quiz-Meister',
    description: '10 Quizzes mit 90%+ bestanden',
    icon: '🎯',
    category: 'quiz' as const,
  },
  {
    id: 'speed_learner',
    name: 'Schnell-Lerner',
    description: '5 Lektionen an einem Tag abgeschlossen',
    icon: '⚡',
    category: 'completion' as const,
  },
  {
    id: 'dedication',
    name: 'Hingabe',
    description: '30 Stunden Lernzeit erreicht',
    icon: '📚',
    category: 'time' as const,
  },
];

// Helper functions
const isToday = (date: Date): boolean => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

const isYesterday = (date: Date): boolean => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return date.toDateString() === yesterday.toDateString();
};

const calculateLevel = (totalPoints: number): { level: number; pointsToNext: number } => {
  const level = Math.floor(totalPoints / 100) + 1;
  const pointsToNext = 100 - (totalPoints % 100);
  return { level, pointsToNext };
};

// Async thunks (would normally call API, using localStorage for now)
export const loadProgress = createAsyncThunk(
  'progress/load',
  async (_, { rejectWithValue }) => {
    try {
      const stored = localStorage.getItem('dailylearn_progress');
      if (stored) {
        const data = JSON.parse(stored);
        // Convert date strings back to Date objects
        if (data.dailyStreak.lastActivityDate) {
          data.dailyStreak.lastActivityDate = new Date(data.dailyStreak.lastActivityDate);
        }
        if (data.dailyStreak.streakStartDate) {
          data.dailyStreak.streakStartDate = new Date(data.dailyStreak.streakStartDate);
        }
        data.achievements = data.achievements?.map((ach: any) => ({
          ...ach,
          unlockedAt: new Date(ach.unlockedAt)
        })) || [];
        
        Object.keys(data.lessonProgress || {}).forEach(lessonId => {
          if (data.lessonProgress[lessonId].completedAt) {
            data.lessonProgress[lessonId].completedAt = new Date(data.lessonProgress[lessonId].completedAt);
          }
        });
        
        return data;
      }
      return initialState;
    } catch (error) {
      return rejectWithValue('Failed to load progress');
    }
  }
);

export const saveProgress = createAsyncThunk(
  'progress/save',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = (getState() as any).progress;
      localStorage.setItem('dailylearn_progress', JSON.stringify(state));
      return state;
    } catch (error) {
      return rejectWithValue('Failed to save progress');
    }
  }
);

// Progress slice
const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {
    completeLesson: (state, action: PayloadAction<{ lessonId: string; timeSpent: number }>) => {
      const { lessonId, timeSpent } = action.payload;
      const today = new Date();
      
      // Update lesson progress
      state.lessonProgress[lessonId] = {
        lessonId,
        completed: true,
        completedAt: today,
        timeSpent,
        quizAttempts: state.lessonProgress[lessonId]?.quizAttempts || 0,
        quizScore: state.lessonProgress[lessonId]?.quizScore,
        quizPassed: state.lessonProgress[lessonId]?.quizPassed,
      };
      
      // Update stats
      const wasAlreadyCompleted = state.userStats.totalLessonsCompleted > 0 && 
        Object.values(state.lessonProgress).filter(p => p.completed).length <= state.userStats.totalLessonsCompleted;
      
      if (!wasAlreadyCompleted) {
        state.userStats.totalLessonsCompleted += 1;
        state.userStats.totalPoints += 50; // Base points for lesson completion
      }
      
      state.userStats.totalTimeSpent += timeSpent;
      
      // Update level
      const { level, pointsToNext } = calculateLevel(state.userStats.totalPoints);
      state.userStats.currentLevel = level;
      state.userStats.pointsToNextLevel = pointsToNext;
      
      // Update daily streak
      const lastActivity = state.dailyStreak.lastActivityDate;
      if (!lastActivity || !isToday(lastActivity)) {
        if (lastActivity && isYesterday(lastActivity)) {
          // Continue streak
          state.dailyStreak.currentStreak += 1;
        } else if (!lastActivity) {
          // First activity ever
          state.dailyStreak.currentStreak = 1;
          state.dailyStreak.streakStartDate = today;
        } else {
          // Streak broken, restart
          state.dailyStreak.currentStreak = 1;
          state.dailyStreak.streakStartDate = today;
        }
        
        state.dailyStreak.lastActivityDate = today;
        state.dailyStreak.longestStreak = Math.max(
          state.dailyStreak.longestStreak,
          state.dailyStreak.currentStreak
        );
        
        state.todayCompleted = true;
      }
      
      // Check for new achievements
      progressSlice.caseReducers.checkAchievements(state);
    },
    
    completeQuiz: (state, action: PayloadAction<{ lessonId: string; score: number; passed: boolean; timeSpent: number }>) => {
      const { lessonId, score, passed, timeSpent } = action.payload;
      
      // Update lesson progress
      if (!state.lessonProgress[lessonId]) {
        state.lessonProgress[lessonId] = {
          lessonId,
          completed: false,
          timeSpent: 0,
          quizAttempts: 0,
        };
      }
      
      state.lessonProgress[lessonId].quizScore = Math.max(
        state.lessonProgress[lessonId].quizScore || 0,
        score
      );
      state.lessonProgress[lessonId].quizPassed = state.lessonProgress[lessonId].quizPassed || passed;
      state.lessonProgress[lessonId].quizAttempts += 1;
      state.lessonProgress[lessonId].timeSpent += timeSpent;
      
      // Update stats
      if (passed && !state.lessonProgress[lessonId].quizPassed) {
        state.userStats.totalQuizzesPassed += 1;
        state.userStats.totalPoints += Math.floor(score / 10) * 5; // Bonus points for quiz score
      }
      
      // Update average quiz score
      const completedQuizzes = Object.values(state.lessonProgress).filter(p => p.quizScore !== undefined);
      if (completedQuizzes.length > 0) {
        state.userStats.averageQuizScore = completedQuizzes.reduce((sum, p) => sum + (p.quizScore || 0), 0) / completedQuizzes.length;
      }
      
      // Update level
      const { level, pointsToNext } = calculateLevel(state.userStats.totalPoints);
      state.userStats.currentLevel = level;
      state.userStats.pointsToNextLevel = pointsToNext;
      
      // Check for new achievements
      progressSlice.caseReducers.checkAchievements(state);
    },
    
    checkAchievements: (state) => {
      const unlockedIds = state.achievements.map(a => a.id);
      const newAchievements: Achievement[] = [];
      
      AVAILABLE_ACHIEVEMENTS.forEach(ach => {
        if (unlockedIds.includes(ach.id)) return;
        
        let shouldUnlock = false;
        
        switch (ach.id) {
          case 'first_lesson':
            shouldUnlock = state.userStats.totalLessonsCompleted >= 1;
            break;
          case 'streak_3':
            shouldUnlock = state.dailyStreak.currentStreak >= 3;
            break;
          case 'streak_7':
            shouldUnlock = state.dailyStreak.currentStreak >= 7;
            break;
          case 'quiz_master':
            const highScoreQuizzes = Object.values(state.lessonProgress).filter(p => (p.quizScore || 0) >= 90);
            shouldUnlock = highScoreQuizzes.length >= 10;
            break;
          case 'speed_learner':
            const todayLessons = Object.values(state.lessonProgress).filter(p => 
              p.completedAt && p.completedAt.toDateString() === new Date().toDateString()
            );
            shouldUnlock = todayLessons.length >= 5;
            break;
          case 'dedication':
            shouldUnlock = state.userStats.totalTimeSpent >= 30 * 60 * 60; // 30 hours in seconds
            break;
        }
        
        if (shouldUnlock) {
          newAchievements.push({
            ...ach,
            unlockedAt: new Date(),
          });
        }
      });
      
      state.achievements.push(...newAchievements);
      
      // Award bonus points for achievements
      state.userStats.totalPoints += newAchievements.length * 25;
      
      // Update level after achievement points
      const { level, pointsToNext } = calculateLevel(state.userStats.totalPoints);
      state.userStats.currentLevel = level;
      state.userStats.pointsToNextLevel = pointsToNext;
    },
    
    resetStreak: (state) => {
      state.dailyStreak.currentStreak = 0;
      state.dailyStreak.streakStartDate = null;
    },
    
    updateTodayStatus: (state) => {
      state.todayCompleted = state.dailyStreak.lastActivityDate ? isToday(state.dailyStreak.lastActivityDate) : false;
    },
    
    clearError: (state) => {
      state.error = null;
    },
  },
  
  extraReducers: (builder) => {
    builder
      .addCase(loadProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadProgress.fulfilled, (state, action) => {
        state.loading = false;
        state.lessonProgress = action.payload.lessonProgress || {};
        state.dailyStreak = action.payload.dailyStreak || state.dailyStreak;
        state.userStats = action.payload.userStats || state.userStats;
        state.achievements = action.payload.achievements || [];
        state.todayCompleted = action.payload.todayCompleted || false;
        state.error = null;
      })
      .addCase(loadProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(saveProgress.pending, (state) => {
        state.loading = true;
      })
      .addCase(saveProgress.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(saveProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  completeLesson,
  completeQuiz,
  checkAchievements,
  resetStreak,
  updateTodayStatus,
  clearError,
} = progressSlice.actions;

export default progressSlice.reducer; 