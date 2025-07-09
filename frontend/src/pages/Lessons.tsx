import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Heart, Eye, Search, ChevronDown, Loader, Filter, X, BookOpen } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchLessons, loadMoreLessons, resetLessons } from '../store/slices/lessonsSlice';
import { fetchThemes } from '../store/slices/themesSlice';
import { Lesson, Theme } from '../types';

const Lessons: React.FC = () => {
  const dispatch = useAppDispatch();
  const { lessons, loading: lessonsLoading, error, pagination } = useAppSelector(state => state.lessons);
  const { themes, loading: themesLoading } = useAppSelector(state => state.themes);
  
  // Filter states
  const [selectedTheme, setSelectedTheme] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  
  // Debounced search
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const difficulties = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' }
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
    
    dispatch(fetchLessons(params));
  }, [dispatch, selectedTheme, selectedDifficulty, searchQuery]);

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

  const clearFilters = () => {
    setSelectedTheme('');
    setSelectedDifficulty('');
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
    
    dispatch(loadMoreLessons(params));
  };

  const hasActiveFilters = selectedTheme || selectedDifficulty || searchQuery;
  const hasMoreLessons = pagination.page < pagination.pages;

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  const getThemeName = (themeId: string) => {
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
        <div className="md:hidden mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {hasActiveFilters && (
              <span className="ml-2 bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
                {[selectedTheme, selectedDifficulty, searchQuery].filter(Boolean).length}
              </span>
            )}
          </button>
        </div>

        {/* Filters */}
        <div className={`md:flex gap-4 items-center ${showFilters ? 'block' : 'hidden md:flex'}`}>
          {/* Theme Filter */}
          <div className="relative mb-4 md:mb-0">
            <select
              value={selectedTheme}
              onChange={handleThemeChange}
              className="appearance-none block w-full md:w-auto px-4 py-2 pr-8 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              disabled={themesLoading}
            >
              <option value="">All Themes</option>
              {themes.map((theme: Theme) => (
                <option key={theme._id} value={theme._id}>
                  {theme.name}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Difficulty Filter */}
          <div className="relative mb-4 md:mb-0">
            <select
              value={selectedDifficulty}
              onChange={handleDifficultyChange}
              className="appearance-none block w-full md:w-auto px-4 py-2 pr-8 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            >
              <option value="">All Difficulties</option>
              {difficulties.map((difficulty) => (
                <option key={difficulty.value} value={difficulty.value}>
                  {difficulty.label}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-primary-600 hover:text-primary-700 font-medium text-sm transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Results info */}
        {!lessonsLoading && lessons.length > 0 && (
          <div className="mt-4 text-sm text-gray-600">
            Showing {lessons.length} of {pagination.total} lessons
            {hasActiveFilters && ' (filtered)'}
          </div>
        )}
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-8 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

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
                <LessonCard key={lesson._id} lesson={lesson} themes={themes} />
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
          {lessons.length > 0 && hasMoreLessons && (
            <div className="mt-12 text-center">
              <button 
                onClick={loadMore}
                className="btn-outline"
                disabled={lessonsLoading}
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

// Separate component for lesson cards with animations
interface LessonCardProps {
  lesson: Lesson;
  themes: Theme[];
}

const LessonCard: React.FC<LessonCardProps> = ({ lesson, themes }) => {
  const [displayStats, setDisplayStats] = useState({ views: 0, likes: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Animate stats on mount
  useEffect(() => {
    const animateStats = () => {
      const duration = 1000; // 1 second
      const steps = 30;
      const viewIncrement = lesson.viewsCount / steps;
      const likeIncrement = lesson.likesCount / steps;
      
      let currentStep = 0;
      const interval = setInterval(() => {
        currentStep++;
        setDisplayStats({
          views: Math.min(Math.floor(viewIncrement * currentStep), lesson.viewsCount),
          likes: Math.min(Math.floor(likeIncrement * currentStep), lesson.likesCount)
        });
        
        if (currentStep >= steps) {
          clearInterval(interval);
          setDisplayStats({
            views: lesson.viewsCount,
            likes: lesson.likesCount
          });
        }
      }, duration / steps);
      
      return () => clearInterval(interval);
    };

    const timer = setTimeout(animateStats, Math.random() * 300); // Stagger animations
    return () => clearTimeout(timer);
  }, [lesson.viewsCount, lesson.likesCount]);

  const getThemeColor = () => {
    if (typeof lesson.themeId === 'object' && lesson.themeId.color) {
      return lesson.themeId.color;
    }
    const theme = themes.find(t => t._id === lesson.themeId);
    return theme?.color || '#6B7280';
  };

  const getThemeName = () => {
    if (typeof lesson.themeId === 'object' && lesson.themeId.name) {
      return lesson.themeId.name;
    }
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

  return (
    <Link
      to={`/lessons/${lesson._id}`}
      className="card hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="aspect-w-16 aspect-h-9 relative overflow-hidden">
        <img
          src={lesson.imageUrl || 'https://via.placeholder.com/400x200?text=No+Image'}
          alt={lesson.title}
          className={`w-full h-48 object-cover transition-transform duration-300 ${
            isHovered ? 'scale-105' : 'scale-100'
          }`}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://via.placeholder.com/400x200?text=No+Image';
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
      </div>
      
      <div className="card-body">
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
              <span className="font-medium">{formatNumber(displayStats.views)}</span>
            </div>
            <div className="flex items-center space-x-1 transition-colors hover:text-red-500">
              <Heart className="h-4 w-4" />
              <span className="font-medium">{formatNumber(displayStats.likes)}</span>
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