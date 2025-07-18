import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

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

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  
  register: async (userData: {
    email: string;
    password: string;
    username: string;
    firstName: string;
    lastName: string;
  }) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  
  logout: async () => {
    const response = await api.post('/auth/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    return response.data;
  },
  
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },
};

// Themes API
export const themesAPI = {
  getAll: async () => {
    const response = await api.get('/themes');
    return {
      ...response.data,
      data: response.data.data?.themes || response.data.data || response.data
    };
  },
  
  getById: async (id: string) => {
    const response = await api.get(`/themes/${id}`);
    return response.data;
  },
  
  getLessons: async (themeId: string) => {
    const response = await api.get(`/themes/${themeId}/lessons`);
    return response.data;
  },
  
  getStats: async () => {
    const response = await api.get('/themes/stats');
    return response.data;
  },
};

// Lessons API
export const lessonsAPI = {
  getAll: async (params?: { 
    themeId?: string; 
    difficulty?: string; 
    search?: string; 
    page?: number; 
    limit?: number;
    status?: string; // new: filter by lesson completion status
    quizStatus?: string; // new: filter by quiz completion status  
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.themeId) queryParams.append('themeId', params.themeId);
    if (params?.difficulty) queryParams.append('difficulty', params.difficulty);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.quizStatus) queryParams.append('quizStatus', params.quizStatus);
    
    const url = queryParams.toString() ? `/lessons?${queryParams.toString()}` : '/lessons';
    const response = await api.get(url);
    return response.data;
  },
  
  getPopular: async (limit?: number) => {
    const queryParams = new URLSearchParams();
    if (limit) queryParams.append('limit', limit.toString());
    
    const url = queryParams.toString() ? `/lessons/popular?${queryParams.toString()}` : '/lessons/popular';
    const response = await api.get(url);
    return response.data;
  },
  
  getFeatured: async (themeId?: string, limit?: number) => {
    const queryParams = new URLSearchParams();
    if (themeId) queryParams.append('themeId', themeId);
    if (limit) queryParams.append('limit', limit.toString());
    
    const url = queryParams.toString() ? `/lessons/featured?${queryParams.toString()}` : '/lessons/featured';
    const response = await api.get(url);
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await api.get(`/lessons/${id}`);
    return response.data;
  },
  
  getToday: async () => {
    const response = await api.get('/lessons/today');
    return response.data;
  },
  
  getDailyLesson: async () => {
    const response = await api.get('/lessons/today');
    return response.data;
  },
  
  getLessonStats: async (id: string) => {
    const response = await api.get(`/lessons/${id}/stats`);
    return response.data;
  },
  
  shareLesson: async (id: string, platform?: string, method?: string) => {
    const response = await api.post(`/lessons/${id}/share`, { platform, method });
    return response.data;
  },
  
  updateProgress: async (id: string, progress: { readingProgress?: number; timeSpent?: number }) => {
    const response = await api.put(`/lessons/${id}/progress`, progress);
    return response.data;
  },
  
  getUserProgress: async (id: string) => {
    const response = await api.get(`/lessons/${id}/progress`);
    return response.data;
  },
  
  markAsCompleted: async (lessonId: string) => {
    const response = await api.put(`/lessons/${lessonId}/progress`, { 
      readingProgress: 100,
      timeSpent: 0 // This would be calculated properly in a real implementation
    });
    return response.data;
  }
};

// Quizzes API
export const quizzesAPI = {
  getByLessonId: async (lessonId: string) => {
    const response = await api.get(`/quizzes/lesson/${lessonId}`);
    return response.data;
  },
  
  submitAttempt: async (quizId: string, answers: { selectedAnswer: string; timeSpent?: number }[]) => {
    const response = await api.post(`/quizzes/${quizId}/attempt`, { answers });
    return response.data;
  },
  
  getAttempts: async (quizId: string) => {
    const response = await api.get(`/quizzes/${quizId}/attempts`);
    return response.data;
  },

  // --- ADMIN QUIZ CRUD ---
  adminList: async () => {
    const response = await api.get('/admin/quizzes');
    return response.data;
  },
  adminGet: async (id: string) => {
    const response = await api.get(`/admin/quizzes/${id}`);
    return response.data;
  },
  adminCreate: async (quiz: any) => {
    const response = await api.post('/admin/quizzes', quiz);
    return response.data;
  },
  adminUpdate: async (id: string, quiz: any) => {
    const response = await api.put(`/admin/quizzes/${id}`, quiz);
    return response.data;
  },
  adminDelete: async (id: string) => {
    const response = await api.delete(`/admin/quizzes/${id}`);
    return response.data;
  },
};

// User API
export const userAPI = {
  getDashboard: async () => {
    const response = await api.get('/users/dashboard');
    return response.data;
  },
  
  getStatistics: async () => {
    const response = await api.get('/users/statistics');
    return response.data;
  },
  
  updateProfile: async (userData: Partial<{
    firstName: string;
    lastName: string;
    preferences: any;
  }>) => {
    const response = await api.put('/auth/profile', userData);
    return response.data;
  },
  updatePreferences: async (preferences: any) => {
    const response = await api.put('/auth/preferences', preferences);
    return response.data;
  },
};

export const adminAPI = {
  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },
};

export default api;