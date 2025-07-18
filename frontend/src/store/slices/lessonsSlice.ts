import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Lesson, LessonState, LessonProgress } from '../../types';
import { lessonsAPI } from '../../services/api';

// Initial state
const initialState: LessonState = {
  lessons: [],
  currentLesson: null,
  selectedLesson: null,
  dailyLesson: null,
  progress: [],
  loading: false,
  error: null,
  success: null,
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
    pages: 0
  }
};

// Async thunks
export const fetchLessons = createAsyncThunk(
  'lessons/fetchAll',
  async (params: { 
    themeId?: string; 
    difficulty?: string; 
    search?: string; 
    page?: number; 
    limit?: number;
    status?: string; // new: filter by lesson completion status
    quizStatus?: string; // new: filter by quiz completion status
  } = {}, { rejectWithValue }) => {
    try {
      const response = await lessonsAPI.getAll(params);
      return {
        lessons: response.data?.lessons || response.data?.data?.lessons || [],
        pagination: response.data?.pagination || response.data?.data?.pagination || {
          page: params.page || 1,
          limit: params.limit || 12,
          total: 0,
          pages: 0
        }
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch lessons');
    }
  }
);

export const loadMoreLessons = createAsyncThunk(
  'lessons/loadMore',
  async (params: { 
    themeId?: string; 
    difficulty?: string; 
    search?: string; 
    page?: number; 
    limit?: number;
    status?: string; // new: filter by lesson completion status
    quizStatus?: string; // new: filter by quiz completion status
  } = {}, { rejectWithValue }) => {
    try {
      const response = await lessonsAPI.getAll(params);
      return {
        lessons: response.data?.lessons || response.data?.data?.lessons || [],
        pagination: response.data?.pagination || response.data?.data?.pagination || {
          page: params.page || 1,
          limit: params.limit || 12,
          total: 0,
          pages: 0
        }
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to load more lessons');
    }
  }
);

export const fetchLessonById = createAsyncThunk(
  'lessons/fetchById',
  async (lessonId: string, { rejectWithValue }) => {
    try {
      const response = await lessonsAPI.getById(lessonId);
      // API returns { success: true, data: { lesson: lessonData } }
      return response.data.data?.lesson || response.data.lesson || response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch lesson');
    }
  }
);

export const fetchDailyLesson = createAsyncThunk(
  'lessons/fetchDaily',
  async (_, { rejectWithValue }) => {
    try {
      const response = await lessonsAPI.getDailyLesson();
      return response.data.lesson || response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch daily lesson');
    }
  }
);

export const markLessonCompleted = createAsyncThunk(
  'lessons/markCompleted',
  async (lessonId: string, { rejectWithValue }) => {
    try {
      const response = await lessonsAPI.markAsCompleted?.(lessonId);
      return { lessonId, progress: response?.data.progress };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark lesson as completed');
    }
  }
);

// Lessons slice
const lessonsSlice = createSlice({
  name: 'lessons',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = null;
    },
    clearMessages: (state) => {
      state.error = null;
      state.success = null;
    },
    setCurrentLesson: (state, action) => {
      state.currentLesson = action.payload;
    },
    setSelectedLesson: (state, action) => {
      state.selectedLesson = action.payload;
    },
    clearCurrentLesson: (state) => {
      state.currentLesson = null;
    },
    clearSelectedLesson: (state) => {
      state.selectedLesson = null;
    },
    updateLessonInList: (state, action) => {
      const { lessonId, updates } = action.payload;
      const lessonIndex = state.lessons.findIndex(lesson => lesson._id === lessonId);
      if (lessonIndex !== -1) {
        state.lessons[lessonIndex] = { ...state.lessons[lessonIndex], ...updates };
      }
      if (state.currentLesson?._id === lessonId) {
        state.currentLesson = { ...state.currentLesson, ...updates };
      }
      if (state.selectedLesson?._id === lessonId) {
        state.selectedLesson = { ...state.selectedLesson, ...updates };
      }
      if (state.dailyLesson?._id === lessonId) {
        state.dailyLesson = { ...state.dailyLesson, ...updates };
      }
    },
    resetLessons: (state) => {
      state.lessons = [];
      state.pagination = {
        page: 1,
        limit: 12,
        total: 0,
        pages: 0
      };
    }
  },
  extraReducers: (builder) => {
    // Fetch all lessons
    builder
      .addCase(fetchLessons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLessons.fulfilled, (state, action) => {
        state.loading = false;
        state.lessons = action.payload.lessons;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(fetchLessons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Load more lessons
    builder
      .addCase(loadMoreLessons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadMoreLessons.fulfilled, (state, action) => {
        state.loading = false;
        // Append new lessons to existing ones
        state.lessons = [...state.lessons, ...action.payload.lessons];
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(loadMoreLessons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch lesson by ID
    builder
      .addCase(fetchLessonById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLessonById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedLesson = action.payload;
        state.error = null;
      })
      .addCase(fetchLessonById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch daily lesson
    builder
      .addCase(fetchDailyLesson.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDailyLesson.fulfilled, (state, action) => {
        state.loading = false;
        state.dailyLesson = action.payload;
        state.error = null;
      })
      .addCase(fetchDailyLesson.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Mark lesson as completed
    builder
      .addCase(markLessonCompleted.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markLessonCompleted.fulfilled, (state, action) => {
        state.loading = false;
        state.success = 'Lesson marked as completed!';
        // Update progress
        if (action.payload.progress) {
          const existingProgressIndex = state.progress.findIndex(
            p => p.lessonId === action.payload.lessonId
          );
          if (existingProgressIndex !== -1) {
            state.progress[existingProgressIndex] = action.payload.progress;
          } else {
            state.progress.push(action.payload.progress);
          }
        }
        state.error = null;
      })
      .addCase(markLessonCompleted.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { 
  clearError, 
  clearSuccess, 
  clearMessages, 
  setCurrentLesson, 
  setSelectedLesson, 
  clearCurrentLesson, 
  clearSelectedLesson, 
  updateLessonInList,
  resetLessons
} = lessonsSlice.actions;

export default lessonsSlice.reducer; 