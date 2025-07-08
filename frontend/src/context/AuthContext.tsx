import React, { createContext, useContext, useEffect } from 'react';
import { User, LoginForm, RegisterForm } from '../types';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { loginUser, registerUser, logoutUser, loadUser, clearError } from '../store/slices/authSlice';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  success: string | null;
  login: (credentials: LoginForm) => Promise<any>;
  register: (data: RegisterForm) => Promise<any>;
  logout: () => Promise<any>;
  clearError: () => void;
  loadUserProfile: () => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, loading, error, success, token } = useAppSelector(state => state.auth);

  // Auto-load user on app start if token exists
  useEffect(() => {
    if (token && !user) {
      dispatch(loadUser());
    }
  }, [dispatch, token, user]);

  const login = async (credentials: LoginForm) => {
    return dispatch(loginUser(credentials));
  };

  const register = async (data: RegisterForm) => {
    return dispatch(registerUser(data));
  };

  const logout = async () => {
    return dispatch(logoutUser());
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  const loadUserProfile = async () => {
    return dispatch(loadUser());
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    loading,
    error,
    success,
    login,
    register,
    logout,
    clearError: handleClearError,
    loadUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 