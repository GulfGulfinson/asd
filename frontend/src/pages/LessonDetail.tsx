import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Heart, Eye, Share, BookOpen, Loader, RotateCcw, CheckCircle } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { fetchLessonById } from '../store/slices/lessonsSlice';
import { completeLesson, saveProgress } from '../store/slices/progressSlice';
import SlideViewer, { SlideViewerRef } from '../components/SlideViewer';
import { parseContentIntoAdvancedSlides } from '../utils/lessonSlidesParser';
import { Theme, Lesson } from '../types/api';

const LessonDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedLesson, loading, error } = useSelector((state: RootState) => state.lessons);
  const { user } = useSelector((state: RootState) => state.auth);
  const startTimeRef = useRef<Date>(new Date());
  const [lessonCompleted, setLessonCompleted] = useState(false);
  
  const [useSlideView, setUseSlideView] = useState(true);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  
  // New state for enhanced functionality
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [viewsCount, setViewsCount] = useState(0);
  const [isLiking, setIsLiking] = useState(false);
  const [showLikeAnimation, setShowLikeAnimation] = useState(false);
  const [showShareTooltip, setShowShareTooltip] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const slideViewerRef = useRef<SlideViewerRef>(null);

  useEffect(() => {
    if (id) {
      console.log('LessonDetail: Fetching lesson with ID:', id);
      // Always use API call to fetch lesson data
      dispatch(fetchLessonById(id));
    }
  }, [dispatch, id]);

  // Update likes and views count when selectedLesson changes
  useEffect(() => {
    console.log('LessonDetail: selectedLesson changed:', selectedLesson);
    if (selectedLesson) {
      setLikesCount(selectedLesson.likesCount);
      setViewsCount(selectedLesson.viewsCount);
    }
  }, [selectedLesson]);

  useEffect(() => {
    // For development, skip authentication check
    // In production, uncomment the lines below
    // if (!user) {
    //   navigate('/login');
    // }
  }, [user, navigate]);

  const handleSlideChange = (slideIndex: number) => {
    setCurrentSlideIndex(slideIndex);
  };

  const handleLessonComplete = useCallback(async () => {
    // Use the actual lesson data (either mock or from store)
    const lesson = selectedLesson;
    if (!lesson || lessonCompleted) return;
    
    // Calculate time spent
    const timeSpent = Math.floor((new Date().getTime() - startTimeRef.current.getTime()) / 1000);
    
    // Mark lesson as completed and track progress
    setLessonCompleted(true);
    
    // Dispatch progress actions
    dispatch(completeLesson({
      lessonId: lesson._id, // Use _id from lesson
      timeSpent: timeSpent
    }));
    
    // Save progress to localStorage
    dispatch(saveProgress());
    
    // Navigate to quiz after a short delay to allow user to see completion
    setTimeout(() => {
      navigate(`/quiz/${lesson._id}`); // Use _id from lesson
    }, 1000);
  }, [selectedLesson, navigate, dispatch, lessonCompleted]);

  const handleLikeLesson = useCallback(async () => {
    if (isLiking) return;
    
    setIsLiking(true);
    
    try {
      // Optimistic update
      const newIsLiked = !isLiked;
      setIsLiked(newIsLiked);
      setLikesCount(prev => newIsLiked ? prev + 1 : Math.max(0, prev - 1));
      
      // Show like animation
      if (newIsLiked) {
        setShowLikeAnimation(true);
        setTimeout(() => setShowLikeAnimation(false), 1000);
      }
      
      // TODO: In production, make actual API call
      // await dispatch(likeLesson(id)).unwrap();
      
    } catch (error) {
      // Revert optimistic update on error
      setIsLiked(prev => !prev);
      setLikesCount(prev => isLiked ? prev + 1 : Math.max(0, prev - 1));
      console.error('Failed to like lesson:', error);
    } finally {
      setIsLiking(false);
    }
  }, [isLiked, isLiking]);

  const handleShareLesson = useCallback(async () => {
    const lesson = selectedLesson;
    if (!lesson) return;

    const shareData = {
      title: lesson.title,
      text: lesson.summary,
      url: window.location.href,
    };

    try {
      // Try native Web Share API first
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        return;
      }
    } catch (error) {
      console.log('Web Share API failed, falling back to clipboard');
    }

    // Fallback to clipboard
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopySuccess(true);
      setShowShareTooltip(true);
      setTimeout(() => {
        setCopySuccess(false);
        setShowShareTooltip(false);
      }, 2000);
    } catch (error) {
      // Final fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = window.location.href;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      setCopySuccess(true);
      setShowShareTooltip(true);
      setTimeout(() => {
        setCopySuccess(false);
        setShowShareTooltip(false);
      }, 2000);
    }
  }, [selectedLesson]);

  const handleRestartLesson = useCallback(() => {
    // Reset slide viewer
    setCurrentSlideIndex(0);
    
    // Reset timer
    startTimeRef.current = new Date();
    
    // Reset completion state
    setLessonCompleted(false);
    
    // If in slide view, reset to first slide
    if (useSlideView && slideViewerRef.current) {
      slideViewerRef.current.resetPresentation();
    }
  }, [useSlideView]);

  // Keyboard shortcuts for lesson navigation
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    // Don't trigger when user is typing in an input
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
      return;
    }

    switch (event.key.toLowerCase()) {
      case 'r':
        if (!event.ctrlKey && !event.metaKey) {
          event.preventDefault();
          handleRestartLesson();
        }
        break;
      case 'l':
        event.preventDefault();
        handleLikeLesson();
        break;
      case 's':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          handleShareLesson();
        }
        break;
    }
  }, [handleRestartLesson, handleLikeLesson, handleShareLesson]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  // Helper function to get theme info
  const getThemeInfo = (themeId: Theme | string) => {
    if (typeof themeId === 'string') {
      return { name: 'Theme', color: '#3B82F6' }; // Fallback values
    }
    return { name: themeId.name, color: themeId.color };
  };

  console.log('LessonDetail: Render state:', { 
    id, 
    selectedLesson: !!selectedLesson, 
    loading, 
    error 
  });

  // Use selectedLesson as the display lesson
  const displayLesson = selectedLesson;

  if (loading && !selectedLesson) {
    console.log('LessonDetail: Showing loading state');
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center py-20">
          <Loader className="h-8 w-8 animate-spin text-primary-600" />
          <span className="ml-2 text-gray-600">Lektion wird geladen...</span>
        </div>
      </div>
    );
  }

  if (error || !selectedLesson) {
    console.log('LessonDetail: Showing error state', { error, selectedLesson: !!selectedLesson });
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Lektion nicht gefunden</h2>
          <p className="text-gray-600 mb-6">
            Die angeforderte Lektion konnte nicht geladen werden.
          </p>
          <Link 
            to="/lessons"
            className="btn-primary"
          >
            Zurück zu den Lektionen
          </Link>
        </div>
      </div>
    );
  }

  if (!displayLesson) {
    return null;
  }

  // Parse lesson content into slides
  const slides = parseContentIntoAdvancedSlides(displayLesson.content, displayLesson.title);
  const themeInfo = getThemeInfo(displayLesson.themeId);

  // Slide view
  if (useSlideView) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header with Keyboard Shortcuts */}
        <div className="mb-6 flex items-center justify-between">
          <Link 
            to="/lessons"
            className="inline-flex items-center text-primary-600 hover:text-primary-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Zurück zu den Lektionen
          </Link>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleRestartLesson}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              title="Lektion neu starten (R)"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Neustart
            </button>
            
            <button
              onClick={() => setUseSlideView(false)}
              className="btn-secondary"
            >
              Zur klassischen Ansicht wechseln
            </button>
          </div>
        </div>

        {/* Keyboard Shortcuts Help */}
        <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="text-sm text-blue-800">
            <span className="font-medium">Tastaturkürzel:</span>
            <span className="ml-4">R: Neustart</span>
            <span className="ml-4">L: Like</span>
            <span className="ml-4">Ctrl+S: Teilen</span>
            <span className="ml-4">← → Pfeiltasten: Navigation</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content area - takes up 2 columns */}
          <div className="lg:col-span-2">
            {/* Lesson Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {displayLesson.title}
              </h1>
              <p className="text-gray-600">
                {displayLesson.summary}
              </p>
            </div>

            {/* Slide Viewer */}
            <SlideViewer
              ref={slideViewerRef}
              slides={slides}
              lessonTitle={displayLesson.title}
              onSlideChange={handleSlideChange}
              onComplete={handleLessonComplete}
            />

            {/* Enhanced Lesson Meta Information */}
            <div className="mt-8 bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <span
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                    style={{
                      backgroundColor: `${themeInfo.color}20`,
                      color: themeInfo.color,
                    }}
                  >
                    {themeInfo.name}
                  </span>
                  <span className="text-sm text-gray-500 capitalize">
                    {displayLesson.difficulty}
                  </span>
                </div>
                
                <div className="flex items-center space-x-4">
                  {/* Enhanced Like Button with Animation */}
                  <div className="relative">
                    <button
                      onClick={handleLikeLesson}
                      disabled={isLiking}
                      className={`flex items-center space-x-1 text-sm transition-all duration-200 ${
                        isLiked 
                          ? 'text-red-500 hover:text-red-600' 
                          : 'text-gray-500 hover:text-red-500'
                      } disabled:opacity-50`}
                      title="Like (L)"
                    >
                      <Heart 
                        className={`h-4 w-4 transition-all duration-200 ${
                          isLiked ? 'fill-current' : ''
                        } ${showLikeAnimation ? 'animate-pulse scale-125' : ''}`} 
                      />
                      <span className="font-medium">{likesCount}</span>
                    </button>
                    
                    {/* Like Animation */}
                    {showLikeAnimation && (
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 pointer-events-none">
                        <div className="animate-bounce text-red-500 text-lg font-bold">
                          +1 ❤️
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Enhanced Share Button */}
                  <div className="relative">
                    <button
                      onClick={handleShareLesson}
                      className="flex items-center space-x-1 text-sm text-gray-500 hover:text-blue-500 transition-colors duration-200"
                      title="Teilen (Ctrl+S)"
                    >
                      {copySuccess ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <Share className="h-4 w-4" />
                      )}
                      <span>Teilen</span>
                    </button>
                    
                    {/* Share Success Tooltip */}
                    {showShareTooltip && (
                      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-green-600 text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none">
                        Link kopiert!
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{displayLesson.estimatedReadTime} Min. Lesezeit</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye className="h-4 w-4" />
                  <span className="font-medium">{viewsCount.toLocaleString()} Aufrufe</span>
                </div>
                <div className="flex items-center space-x-1">
                  <BookOpen className="h-4 w-4" />
                  <span>Folie {currentSlideIndex + 1} von {slides.length}</span>
                </div>
              </div>

              {/* Tags */}
              {displayLesson.tags && displayLesson.tags.length > 0 && (
                <div className="mt-4">
                  <div className="flex flex-wrap gap-2">
                    {displayLesson.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Classic view (fallback) - also enhanced
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Enhanced Header */}
      <div className="mb-6 flex items-center justify-between">
        <Link 
          to="/lessons"
          className="inline-flex items-center text-primary-600 hover:text-primary-700"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Zurück zu den Lektionen
        </Link>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleRestartLesson}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            title="Lektion neu starten (R)"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Neustart
          </button>
          
          <button
            onClick={() => setUseSlideView(true)}
            className="btn-secondary"
          >
            Zur Folien-Ansicht wechseln
          </button>
        </div>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <span
            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
            style={{
              backgroundColor: `${themeInfo.color}20`,
              color: themeInfo.color,
            }}
          >
            {themeInfo.name}
          </span>
          <span className="text-sm text-gray-500 capitalize">
            {displayLesson.difficulty}
          </span>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {displayLesson.title}
        </h1>

        <p className="text-xl text-gray-600 mb-6">
          {displayLesson.summary}
        </p>

        {/* Enhanced Meta info */}
        <div className="flex items-center space-x-6 text-sm text-gray-500 mb-6">
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>{displayLesson.estimatedReadTime} Min. Lesezeit</span>
          </div>
          <div className="flex items-center space-x-1">
            <Eye className="h-4 w-4" />
            <span className="font-medium">{viewsCount.toLocaleString()} Aufrufe</span>
          </div>
          <div className="flex items-center space-x-1">
            <Heart className={`h-4 w-4 ${isLiked ? 'text-red-500 fill-current' : ''}`} />
            <span className="font-medium">{likesCount} Likes</span>
          </div>
        </div>

        {/* Enhanced Actions */}
        <div className="flex items-center space-x-4 mb-8">
          <div className="relative">
            <button 
              onClick={handleLikeLesson}
              disabled={isLiking}
              className={`btn-primary inline-flex items-center transition-all duration-200 ${
                isLiked ? 'bg-red-600 hover:bg-red-700' : ''
              } disabled:opacity-50`}
            >
              <Heart className={`h-4 w-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
              {isLiked ? 'Geliked' : 'Like'}
            </button>
            
            {showLikeAnimation && (
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 pointer-events-none">
                <div className="animate-bounce text-red-500 text-lg font-bold">
                  +1 ❤️
                </div>
              </div>
            )}
          </div>
          
          <div className="relative">
            <button 
              onClick={handleShareLesson}
              className="btn-secondary inline-flex items-center"
            >
              {copySuccess ? (
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
              ) : (
                <Share className="h-4 w-4 mr-2" />
              )}
              Teilen
            </button>
            
            {showShareTooltip && (
              <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-green-600 text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none">
                Link kopiert!
              </div>
            )}
          </div>
        </div>

        {/* Featured Image */}
        {displayLesson.imageUrl && (
          <div className="mb-8">
            <img
              src={displayLesson.imageUrl}
              alt={displayLesson.title}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="prose prose-lg max-w-none mb-12">
        <div dangerouslySetInnerHTML={{ __html: displayLesson.content }} />
      </div>

      {/* Tags */}
      {displayLesson.tags && displayLesson.tags.length > 0 && (
        <div className="mb-8">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Tags</h4>
          <div className="flex flex-wrap gap-2">
            {displayLesson.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Complete Lesson Button */}
      <div className="text-center">
        <button
          onClick={handleLessonComplete}
          className="btn-primary btn-lg"
          disabled={lessonCompleted}
        >
          {lessonCompleted ? '✅ Lektion abgeschlossen' : 'Lektion abschließen'}
        </button>
      </div>
    </div>
  );
};

export default LessonDetail; 