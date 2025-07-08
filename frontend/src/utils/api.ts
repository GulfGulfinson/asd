import axios, { AxiosResponse } from 'axios';
import { ApiResponse, AuthResponse, LoginCredentials, RegisterData } from '../types/api';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API functions
export const authApi = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  getProfile: async (): Promise<ApiResponse> => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  updateProfile: async (data: Partial<any>): Promise<ApiResponse> => {
    const response = await api.put('/auth/profile', data);
    return response.data;
  },

  updatePreferences: async (preferences: any): Promise<ApiResponse> => {
    const response = await api.put('/auth/preferences', preferences);
    return response.data;
  },

  changePassword: async (data: { currentPassword: string; newPassword: string }): Promise<ApiResponse> => {
    const response = await api.put('/auth/change-password', data);
    return response.data;
  },
};

// Theme API functions
export const themeApi = {
  getThemes: async (params?: { page?: number; limit?: number }): Promise<ApiResponse> => {
    const response = await api.get('/themes', { params });
    return response.data;
  },

  getThemeBySlug: async (slug: string): Promise<ApiResponse> => {
    const response = await api.get(`/themes/${slug}`);
    return response.data;
  },
};

// Lesson API functions
export const lessonApi = {
  getLessons: async (params?: {
    page?: number;
    limit?: number;
    theme?: string;
    difficulty?: string;
    tags?: string;
  }): Promise<ApiResponse> => {
    const response = await api.get('/lessons', { params });
    return response.data;
  },

  getLessonById: async (id: string): Promise<ApiResponse> => {
    const response = await api.get(`/lessons/${id}`);
    return response.data;
  },

  updateProgress: async (lessonId: string, data: {
    readingProgress?: number;
    timeSpent?: number;
  }): Promise<ApiResponse> => {
    const response = await api.put(`/lessons/${lessonId}/progress`, data);
    return response.data;
  },

  toggleLike: async (lessonId: string): Promise<ApiResponse> => {
    const response = await api.post(`/lessons/${lessonId}/like`);
    return response.data;
  },
};

// Health check
export const healthCheck = async (): Promise<ApiResponse> => {
  const response = await api.get('/health');
  return response.data;
};

export default api; 