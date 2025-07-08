import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Theme, ThemeState } from '../../types';
import { themesAPI } from '../../services/api';

// Initial state
const initialState: ThemeState = {
  themes: [],
  selectedTheme: null,
  loading: false,
  error: null,
  success: null,
};

// Async thunks
export const fetchThemes = createAsyncThunk(
  'themes/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await themesAPI.getAll();
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch themes');
    }
  }
);

export const fetchThemeById = createAsyncThunk(
  'themes/fetchById',
  async (themeId: string, { rejectWithValue }) => {
    try {
      const response = await themesAPI.getById(themeId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch theme');
    }
  }
);

// Themes slice
const themesSlice = createSlice({
  name: 'themes',
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
    setSelectedTheme: (state, action) => {
      state.selectedTheme = action.payload;
    },
    clearSelectedTheme: (state) => {
      state.selectedTheme = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all themes
    builder
      .addCase(fetchThemes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchThemes.fulfilled, (state, action) => {
        state.loading = false;
        state.themes = action.payload;
        state.error = null;
      })
      .addCase(fetchThemes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch theme by ID
    builder
      .addCase(fetchThemeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchThemeById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedTheme = action.payload;
        state.error = null;
      })
      .addCase(fetchThemeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { 
  clearError, 
  clearSuccess, 
  clearMessages, 
  setSelectedTheme, 
  clearSelectedTheme 
} = themesSlice.actions;

export default themesSlice.reducer; 