import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { loginUser, clearError } from '../store/slices/authSlice';
import { BookOpen, Eye, EyeOff, Loader } from 'lucide-react';

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user, loading, error } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  // Clear error when component mounts
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    dispatch(clearError());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const result = await dispatch(loginUser(formData));
      if (result.type === 'auth/login/fulfilled') {
        const from = location.state?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
      }
    } catch (err) {
      // Error is handled by the auth slice
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && !isSubmitting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <Loader className="h-8 w-8 animate-spin text-primary-600" />
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <Link to="/" className="flex items-center space-x-2">
              <BookOpen className="h-12 w-12 text-primary-600" />
              <span className="text-2xl font-bold text-gray-900">DailyLearn</span>
            </Link>
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link
              to="/register"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              create a new account
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="input"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="relative">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                className="input pr-10"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <button type="button" className="font-medium text-primary-600 hover:text-primary-500">
                Forgot your password?
              </button>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting || loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <Loader className="h-4 w-4 animate-spin mr-2" />
                  Signing in...
                </div>
              ) : (
                'Sign in'
              )}
            </button>
          </div>

          {/* Demo credentials */}
          <div className="mt-6 p-4 bg-gray-100 rounded-md">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Demo Credentials:</h3>
            <div className="text-xs text-gray-600 space-y-1">
              <div><strong>Admin:</strong> admin@dailylearn.com / admin123</div>
              <div><strong>User:</strong> max.mustermann@example.com / password123</div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login; 