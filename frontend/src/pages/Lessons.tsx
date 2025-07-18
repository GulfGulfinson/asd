import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Clock, Heart, Eye, Search, ChevronDown, Loader, Filter, X, BookOpen, CheckCircle, Trophy, AlertCircle, PlayCircle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchLessons, loadMoreLessons, resetLessons } from '../store/slices/lessonsSlice';
import { fetchThemes } from '../store/slices/themesSlice';
import { Lesson, Theme } from '../types';

const Lessons: React.FC = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { lessons, loading: lessonsLoading, error, pagination } = useAppSelector(state => state.lessons);
  const { themes = [], loading: themesLoading } = useAppSelector(state => state.themes || { themes: [], loading: false });
  const { isAuthenticated } = useAppSelector(state => state.auth);
  
  // Filter states
  const [selectedTheme, setSelectedTheme] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>(''); // new: lesson completion status filter
  const [selectedQuizStatus, setSelectedQuizStatus] = useState<string>(''); // new: quiz status filter
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  
  // Debounced search
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const difficulties = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' }
  ];

  // Status filter options (only show if authenticated)
  const statusOptions = [
    { value: 'completed', label: 'Abgeschlossen' },
    { value: 'in_progress', label: 'In Bearbeitung' },
    { value: 'not_started', label: 'Nicht begonnen' }
  ];

  // Quiz status filter options (only show if authenticated)
  const quizStatusOptions = [
    { value: 'passed', label: 'Quiz bestanden' },
    { value: 'failed', label: 'Quiz nicht bestanden' },
    { value: 'not_attempted', label: 'Quiz nicht versucht' },
    { value: 'no_quiz', label: 'Kein Quiz' }
  ];

  // Fetch themes on component mount
  useEffect(() => {
    dispatch(fetchThemes());
  }, [dispatch]);

  // Fetch lessons when filters change
  useEffect(() => {
    dispatch(resetLessons()); // Clear existing lessons when filters change
    
    const params: any = {
      page: 1,
      limit: 12
    };
    
    if (selectedTheme) params.themeId = selectedTheme;
    if (selectedDifficulty) params.difficulty = selectedDifficulty;
    if (searchQuery.trim()) params.search = searchQuery.trim();
    if (isAuthenticated && selectedStatus) params.status = selectedStatus;
    if (isAuthenticated && selectedQuizStatus) params.quizStatus = selectedQuizStatus;
    
    dispatch(fetchLessons(params));
  }, [dispatch, selectedTheme, selectedDifficulty, searchQuery, selectedStatus, selectedQuizStatus, isAuthenticated]);

  // Refetch lessons when returning from a detail page
  useEffect(() => {
    if (location.state && location.state.fromLessonDetail) {
      const params: any = {
        page: 1,
        limit: 12
      };
      if (selectedTheme) params.themeId = selectedTheme;
      if (selectedDifficulty) params.difficulty = selectedDifficulty;
      if (searchQuery.trim()) params.search = searchQuery.trim();
      if (isAuthenticated && selectedStatus) params.status = selectedStatus;
      if (isAuthenticated && selectedQuizStatus) params.quizStatus = selectedQuizStatus;
      dispatch(fetchLessons(params));
    }
  }, [location.state]);

  // Debounced search handler
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // No need to reset page since useEffect handles filter changes
  };

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTheme(e.target.value);
  };

  const handleDifficultyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDifficulty(e.target.value);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(e.target.value);
  };

  const handleQuizStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedQuizStatus(e.target.value);
  };

  const clearFilters = () => {
    setSelectedTheme('');
    setSelectedDifficulty('');
    setSelectedStatus('');
    setSelectedQuizStatus('');
    setSearchQuery('');
  };

  const loadMore = () => {
    const nextPage = pagination.page + 1;
    const params: any = {
      page: nextPage,
      limit: 12
    };
    
    if (selectedTheme) params.themeId = selectedTheme;
    if (selectedDifficulty) params.difficulty = selectedDifficulty;
    if (searchQuery.trim()) params.search = searchQuery.trim();
    if (isAuthenticated && selectedStatus) params.status = selectedStatus;
    if (isAuthenticated && selectedQuizStatus) params.quizStatus = selectedQuizStatus;
    
    dispatch(loadMoreLessons(params));
  };

  const hasActiveFilters = selectedTheme || selectedDifficulty || selectedStatus || selectedQuizStatus || searchQuery;
  const hasMoreLessons = pagination.page < pagination.pages;

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  const getThemeName = (themeId: string) => {
    if (!Array.isArray(themes) || themes.length === 0) return 'Unknown Theme';
    const theme = themes.find(t => t._id === themeId);
    return theme?.name || 'Unknown Theme';
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Explore Lessons
        </h1>
        <p className="text-gray-600">
          Discover curated content across various topics to expand your knowledge.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8">
        {/* Search Bar */}
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search lessons..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>

        {/* Filter Toggle (Mobile) */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <Filter className="h-5 w-5 mr-2" />
            Filters
            <ChevronDown className={`h-5 w-5 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Filter Options */}
        <div className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {/* Theme Filter */}
            <div>
              <label htmlFor="theme-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Theme
              </label>
              <select
                id="theme-filter"
                value={selectedTheme}
                onChange={handleThemeChange}
                className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
              >
                <option value="">All Themes</option>
                {Array.isArray(themes) && themes.map((theme) => (
                  <option key={theme._id} value={theme._id}>
                    {theme.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty Filter */}
            <div>
              <label htmlFor="difficulty-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Difficulty
              </label>
              <select
                id="difficulty-filter"
                value={selectedDifficulty}
                onChange={handleDifficultyChange}
                className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
              >
                <option value="">All Levels</option>
                {difficulties.map((difficulty) => (
                  <option key={difficulty.value} value={difficulty.value}>
                    {difficulty.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter (only show if authenticated) */}
            {isAuthenticated && (
              <div>
                <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="status-filter"
                  value={selectedStatus}
                  onChange={handleStatusChange}
                  className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                >
                  <option value="">Alle Status</option>
                  {statusOptions.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Quiz Status Filter (only show if authenticated) */}
            {isAuthenticated && (
              <div>
                <label htmlFor="quiz-status-filter" className="block text-sm font-medium text-gray-700 mb-1">
                  Quiz Status
                </label>
                <select
                  id="quiz-status-filter"
                  value={selectedQuizStatus}
                  onChange={handleQuizStatusChange}
                  className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                >
                  <option value="">Alle Quiz Status</option>
                  {quizStatusOptions.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors text-sm"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Loading State */}
      {lessonsLoading && lessons.length === 0 && (
        <div className="flex justify-center items-center py-12">
          <Loader className="h-8 w-8 animate-spin text-primary-600" />
          <span className="ml-2 text-gray-600">Loading lessons...</span>
        </div>
      )}

      {/* Lessons Grid */}
      {!lessonsLoading || lessons.length > 0 ? (
        <>
          {lessons.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lessons.map((lesson: Lesson) => (
                <LessonCard key={lesson._id} lesson={lesson} themes={Array.isArray(themes) ? themes : []} isAuthenticated={isAuthenticated} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <BookOpen className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No lessons found</h3>
              <p className="text-gray-600 mb-4">
                {hasActiveFilters 
                  ? "Try adjusting your filters to find more lessons."
                  : "There are no lessons available at the moment."
                }
              </p>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="btn-primary">
                  Clear Filters
                </button>
              )}
            </div>
          )}

          {/* Load More Button */}
          {hasMoreLessons && lessons.length > 0 && (
            <div className="text-center mt-8">
              <button
                onClick={loadMore}
                disabled={lessonsLoading}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {lessonsLoading ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin mr-2" />
                    Loading...
                  </>
                ) : (
                  'Load More Lessons'
                )}
              </button>
            </div>
          )}
        </>
      ) : null}
    </div>
  );
};

// Separate component for lesson cards with animations and status indicators
interface LessonCardProps {
  lesson: Lesson;
  themes?: Theme[];
  isAuthenticated: boolean;
}

const LessonCard: React.FC<LessonCardProps> = ({ lesson, themes = [], isAuthenticated }) => {
  const [displayViews, setDisplayViews] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Animate views on mount
  useEffect(() => {
    const animateViews = () => {
      const duration = 1500; // 1.5 seconds
      const steps = 60; // 60 FPS
      const viewIncrement = lesson.viewsCount / steps;
      let currentStep = 0;
      const interval = setInterval(() => {
        currentStep++;
        setDisplayViews(Math.min(Math.floor(viewIncrement * currentStep), lesson.viewsCount));
        if (currentStep >= steps) {
          clearInterval(interval);
          setDisplayViews(lesson.viewsCount);
        }
      }, duration / steps);
      return () => clearInterval(interval);
    };
    // Add a small random delay to stagger animations
    const timer = setTimeout(animateViews, Math.random() * 500);
    return () => clearTimeout(timer);
  }, [lesson.viewsCount]);

  const getThemeColor = () => {
    if (typeof lesson.themeId === 'object' && lesson.themeId.color) {
      return lesson.themeId.color;
    }
    if (!Array.isArray(themes) || themes.length === 0) return '#6B7280';
    const theme = themes.find(t => t._id === lesson.themeId);
    return theme?.color || '#6B7280';
  };

  const getThemeName = () => {
    if (typeof lesson.themeId === 'object' && lesson.themeId.name) {
      return lesson.themeId.name;
    }
    if (!Array.isArray(themes) || themes.length === 0) return 'Unknown Theme';
    const theme = themes.find(t => t._id === lesson.themeId);
    return theme?.name || 'Unknown Theme';
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  const getDefaultImage = () => {
    // Create a themed fallback image based on the lesson's theme
    const themeColor = getThemeColor();
    const themeName = getThemeName();
    const themeIcon = typeof lesson.themeId === 'object' ? lesson.themeId.icon : '📚';
    
    // Map theme names to Unsplash image categories/keywords
    const themeImageMap: Record<string, string> = {
      'Data Science': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop&crop=center',
      'Programmierung': 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=200&fit=crop&crop=center',
      'Design & UX': 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=400&h=200&fit=crop&crop=center',
      'Business & Entrepreneurship': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=200&fit=crop&crop=center',
      'Machine Learning': 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=200&fit=crop&crop=center',
      'Technology': 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=200&fit=crop&crop=center',
      'Science': 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=200&fit=crop&crop=center',
      'Psychology': 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=200&fit=crop&crop=center'
    };
    
    return themeImageMap[themeName] || 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=200&fit=crop&crop=center';
  };

  // Get status indicators for authenticated users
  const getStatusIndicators = () => {
    if (!isAuthenticated) return null;

    const indicators = [];

    // Lesson completion status - prioritize lessonCompleted over userProgress status
    if (lesson.lessonCompleted) {
      indicators.push(
        <div key="lesson-completed" className="flex items-center space-x-1 text-green-600" title="Lektion abgeschlossen">
          <CheckCircle className="h-4 w-4" />
          <span className="text-xs font-medium">Abgeschlossen</span>
        </div>
      );
    } else if (lesson.userProgress?.status === 'in_progress') {
      indicators.push(
        <div key="lesson-progress" className="flex items-center space-x-1 text-blue-600" title="In Bearbeitung">
          <PlayCircle className="h-4 w-4" />
          <span className="text-xs font-medium">In Bearbeitung</span>
        </div>
      );
    }

    // Quiz status
    if (lesson.hasQuiz) {
      if (lesson.quizPassed) {
        indicators.push(
          <div key="quiz-passed" className="flex items-center space-x-1 text-yellow-600" title={`Quiz bestanden (${lesson.lastQuizAttempt?.score}%)`}>
            <Trophy className="h-4 w-4" />
            <span className="text-xs font-medium">{lesson.lastQuizAttempt?.score}%</span>
          </div>
        );
      } else if (lesson.quizAttempted) {
        indicators.push(
          <div key="quiz-failed" className="flex items-center space-x-1 text-red-600" title={`Quiz nicht bestanden (${lesson.lastQuizAttempt?.score}%)`}>
            <AlertCircle className="h-4 w-4" />
            <span className="text-xs font-medium">{lesson.lastQuizAttempt?.score}%</span>
          </div>
        );
      }
    }

    return indicators.length > 0 ? (
      <div className="flex flex-wrap gap-2 mb-3">
        {indicators}
      </div>
    ) : null;
  };

  return (
    <Link
      to={`/lessons/${lesson._id}`}
      className="card hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="aspect-w-16 aspect-h-9 relative overflow-hidden">
        <img
          src={lesson.imageUrl || getDefaultImage()}
          alt=""
          className={`w-full h-48 object-cover transition-transform duration-300 ${
            isHovered ? 'scale-105' : 'scale-100'
          }`}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (target.src !== getDefaultImage()) {
              target.src = getDefaultImage();
              target.alt = '';
            }
          }}
        />
        <div className="absolute top-4 left-4">
          <span
            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white"
            style={{ backgroundColor: getThemeColor() }}
          >
            {getThemeName()}
          </span>
        </div>
        
        {/* Status badges overlay */}
        {isAuthenticated && (
          <div className="absolute top-4 right-4 flex flex-col space-y-1">
            {lesson.lessonCompleted && (
              <div className="bg-green-500 text-white rounded-full p-1" title="Lektion abgeschlossen">
                <CheckCircle className="h-4 w-4" />
              </div>
            )}
            {lesson.hasQuiz && lesson.quizPassed && (
              <div className="bg-yellow-500 text-white rounded-full p-1" title="Quiz bestanden">
                <Trophy className="h-4 w-4" />
              </div>
            )}
            {lesson.hasQuiz && lesson.quizAttempted && !lesson.quizPassed && (
              <div className="bg-red-500 text-white rounded-full p-1" title="Quiz nicht bestanden">
                <AlertCircle className="h-4 w-4" />
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="card-body">
        {/* Status indicators for authenticated users */}
        {getStatusIndicators()}
        
        <div className="flex items-center justify-between mb-3">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getDifficultyColor(lesson.difficulty)}`}>
            {lesson.difficulty}
          </span>
          <span className="text-xs text-gray-500 flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            {lesson.estimatedReadTime} min
          </span>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-primary-600 transition-colors">
          {lesson.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {lesson.summary}
        </p>
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 transition-colors hover:text-primary-600">
              <Eye className="h-4 w-4" />
              <span className="font-medium tabular-nums">{formatNumber(displayViews)}</span>
            </div>
          </div>
          <span className="text-xs text-gray-400">
            {lesson.publishedAt && new Date(lesson.publishedAt).toLocaleDateString()}
          </span>
        </div>
        
        {lesson.tags && lesson.tags.length > 0 && (
          <div className="mt-4">
            <div className="flex flex-wrap gap-1">
              {lesson.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  {tag}
                </span>
              ))}
              {lesson.tags.length > 3 && (
                <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-500">
                  +{lesson.tags.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </Link>
  );
};

export default Lessons; 