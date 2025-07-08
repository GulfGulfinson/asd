import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import lessonsReducer from './slices/lessonsSlice';
import quizReducer from './slices/quizSlice';
import progressReducer from './slices/progressSlice';
import themesReducer from './slices/themesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    lessons: lessonsReducer,
    quiz: quizReducer,
    progress: progressReducer,
    themes: themesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 