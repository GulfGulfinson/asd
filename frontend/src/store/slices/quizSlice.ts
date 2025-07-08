import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { quizzesAPI } from '../../services/api';

// Types
export interface QuizQuestion {
  _id?: string;
  question: string;
  type: 'multiple_choice' | 'true_false' | 'fill_blank';
  options?: string[];
  correctAnswer: string;
  explanation?: string;
  points?: number;
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

export interface QuizAnswer {
  questionIndex: number;
  selectedAnswer: string;
  isCorrect?: boolean;
  timeSpent?: number;
}

export interface QuizAttempt {
  _id: string;
  userId: string;
  quizId: string;
  lessonId: string;
  answers: QuizAnswer[];
  score: number;
  passed: boolean;
  completedAt: Date;
  timeSpent: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface QuizState {
  currentQuiz: Quiz | null;
  currentAttempt: QuizAttempt | null;
  attempts: QuizAttempt[];
  userAnswers: Record<number, string>;
  currentQuestionIndex: number;
  timeRemaining: number;
  quizStartTime: number | null;
  loading: boolean;
  error: string | null;
  isSubmitting: boolean;
  showResults: boolean;
}

const initialState: QuizState = {
  currentQuiz: null,
  currentAttempt: null,
  attempts: [],
  userAnswers: {},
  currentQuestionIndex: 0,
  timeRemaining: 0,
  quizStartTime: null,
  loading: false,
  error: null,
  isSubmitting: false,
  showResults: false,
};

// Async thunks
export const fetchQuizByLessonId = createAsyncThunk(
  'quiz/fetchByLessonId',
  async (lessonId: string, { rejectWithValue }) => {
    try {
      const response = await quizzesAPI.getByLessonId(lessonId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch quiz');
    }
  }
);

export const submitQuizAttempt = createAsyncThunk(
  'quiz/submitAttempt',
  async ({ quizId, answers }: { quizId: string; answers: { questionId: string; selectedOption: number }[] }, { rejectWithValue }) => {
    try {
      const response = await quizzesAPI.submitAttempt(quizId, answers);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to submit quiz');
    }
  }
);

export const fetchQuizAttempts = createAsyncThunk(
  'quiz/fetchAttempts',
  async (quizId: string, { rejectWithValue }) => {
    try {
      const response = await quizzesAPI.getAttempts(quizId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch attempts');
    }
  }
);

// Quiz slice
const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    setUserAnswer: (state, action: PayloadAction<{ questionIndex: number; answer: string }>) => {
      state.userAnswers[action.payload.questionIndex] = action.payload.answer;
    },
    
    setCurrentQuestionIndex: (state, action: PayloadAction<number>) => {
      state.currentQuestionIndex = action.payload;
    },
    
    nextQuestion: (state) => {
      if (state.currentQuiz && state.currentQuestionIndex < state.currentQuiz.questions.length - 1) {
        state.currentQuestionIndex += 1;
      }
    },
    
    previousQuestion: (state) => {
      if (state.currentQuestionIndex > 0) {
        state.currentQuestionIndex -= 1;
      }
    },
    
    startQuiz: (state) => {
      state.quizStartTime = Date.now();
      state.timeRemaining = state.currentQuiz?.timeLimit ? state.currentQuiz.timeLimit * 60 : 0;
      state.currentQuestionIndex = 0;
      state.userAnswers = {};
      state.showResults = false;
    },
    
    updateTimeRemaining: (state, action: PayloadAction<number>) => {
      state.timeRemaining = Math.max(0, action.payload);
    },
    
    timeUp: (state) => {
      state.timeRemaining = 0;
      // Auto-submit quiz when time is up
    },
    
    showQuizResults: (state) => {
      state.showResults = true;
    },
    
    resetQuiz: (state) => {
      state.currentQuiz = null;
      state.currentAttempt = null;
      state.userAnswers = {};
      state.currentQuestionIndex = 0;
      state.timeRemaining = 0;
      state.quizStartTime = null;
      state.showResults = false;
      state.error = null;
    },
    
    clearError: (state) => {
      state.error = null;
    },
  },
  
  extraReducers: (builder) => {
    builder
      // Fetch quiz by lesson ID
      .addCase(fetchQuizByLessonId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuizByLessonId.fulfilled, (state, action) => {
        state.loading = false;
        state.currentQuiz = action.payload.data;
        state.timeRemaining = action.payload.data.timeLimit ? action.payload.data.timeLimit * 60 : 0;
      })
      .addCase(fetchQuizByLessonId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Submit quiz attempt
      .addCase(submitQuizAttempt.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(submitQuizAttempt.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.currentAttempt = action.payload.data;
        state.showResults = true;
      })
      .addCase(submitQuizAttempt.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      })
      
      // Fetch quiz attempts
      .addCase(fetchQuizAttempts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchQuizAttempts.fulfilled, (state, action) => {
        state.loading = false;
        state.attempts = action.payload.data;
      })
      .addCase(fetchQuizAttempts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setUserAnswer,
  setCurrentQuestionIndex,
  nextQuestion,
  previousQuestion,
  startQuiz,
  updateTimeRemaining,
  timeUp,
  showQuizResults,
  resetQuiz,
  clearError,
} = quizSlice.actions;

export default quizSlice.reducer; 